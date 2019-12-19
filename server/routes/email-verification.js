const User = require('mongoose').model('User')
const config = require('../../config')
const { verifyEmailVerificationToken } = require('../../helpers/tokens')
const sendMail = require('../../helpers/email')
const fs = require('fs')
const path = require('path');

function checkIsEmailVerified(userId) {
  return User.findById(userId)
    .then(user => {
      if (!user) {
        return Promise.reject({ message: 'user not exists' })
      }
      if (user.isEmailVerified) {
        return Promise.reject({
          errors: {
            emailVerification: 'EMAIL_ALREADY_VERIFIED'
          }
        });
      }
      return Promise.resolve(user)
    })
}

function sendVerificationEmail(user) {
  return new Promise((resolve, reject) => {
    if (!user) {
      return reject({ message: 'user not exists' })
    }
    const emailVerificationToken = user.getEmailVerificationToken();
    let template = fs.readFileSync(path.join(__dirname, '../emailtemplates/email-verification.html'), 'utf8');
    template = template.replace('{{emailVerificationUrl}}', config.emailVerificationUrl + '/' + emailVerificationToken)

    return user.save()
      .then(() => {
        const mailOptions = {
          to: user.email,
          subject: 'Email Verification',
          html: template
        };
        return sendMail(mailOptions)
          .then(() => {
            return resolve({
              payload: {
                success: true
              }
            })
          })
          .catch(err => {
            // console.error(err);
            return reject({
              errors: {
                emailVerification: 'FAILED_SEND_VERIFICATION_EMAIL'
              }
            })
          })
      })
      .catch((err) => reject({ message: 'user update failed '}))
  })
}

function handleEmailVerificationRequest (req, res) {
  return checkIsEmailVerified(req.user._id)
    .then(user => {
      return sendVerificationEmail(user)
        .then(result => {
          return res.json(result)
        })
    })
    .catch(err => {
      console.log(err);
      if (err.message) {
        return res.status(404).jsonp(err).end()
      }
      return res.json(err)
    })
}

function verifyEmail (req, res) {
  if (!req.body || !req.body.token) {
    return res.status(400).jsonp({ message: 'email verification token required' }).end()
  }
  return verifyEmailVerificationToken(req.body.token)
    .then(decoded => {
      return checkIsEmailVerified(decoded.userId)
        .then(user => {
          if (user.emailVerificationTokenCreated.toJSON() === decoded.created) {
            user.isEmailVerified = true

            return user.save()
              .then(() => res.jsonp({ success: true }).end())
              .catch(() => res.status(400).jsonp({ message: 'email verification failed' }).end())
          }
          return res.status(400).jsonp({ message: 'email verification failed' }).end()
        })
        .catch(err => {
          if (err.message) {
            return res.status(404).jsonp(err).end()
          }
          return res.json(err)
        })
    })
    .catch(err => res.status(401).jsonp({ message: 'you are not authorized' }).end())
}

module.exports = { sendVerificationEmail, handleEmailVerificationRequest, verifyEmail }
