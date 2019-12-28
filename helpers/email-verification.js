const User = require('mongoose').model('User')
const config = require('../config')

const verificationEmailTypes = {
  WELCOME: 1,
  RESEND: 2,
  REVERIFY: 3,
  ROLLBACK: 4
}

function checkIsEmailVerified(data, isUserId) {
  const query = isUserId === true ? {_id: data} : {email: data};
  return User.findOne(query).exec()
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

function getTemplate(mailer, emailType) {
  let template, subject
  if (emailType === verificationEmailTypes.WELCOME) {
    template = mailer.getTemplate('welcomeVerification')
    subject = 'Welcome'
  } else if (emailType === verificationEmailTypes.RESEND) {
    template = mailer.getTemplate('verification')
    subject = 'Email Verification'
  } else if (emailType === verificationEmailTypes.REVERIFY) {
    template = mailer.getTemplate('reverification')
    subject = 'Email Changed'
  } else if (emailType === verificationEmailTypes.ROLLBACK) {
    template = mailer.getTemplate('rollbackEmail')
    subject = 'Email Changed'
  }
  if (template) {
    return Promise.resolve({template, subject})
  } else {
    return Promise.reject({ message: 'load email template failed'})
  }
}

function mockSendMail(user, shouldNotCreateNewToken, emailVerificationToken, to, emailType) {
  if (shouldNotCreateNewToken) {
    return Promise.resolve({
      emailVerificationToken,
      email: to,
      id: user._id,
      type: emailType
    })
  } else {
    return user.save()
      .then(() => Promise.resolve({
        emailVerificationToken,
        email: to,
        id: user._id,
        type: emailType
      }))
      .catch((err) => Promise.reject({ message: 'user update failed'}))
  }
}

function sendMail(mailer, mailOptions) {
  return mailer.send(mailOptions)
    .then(() => Promise.resolve({}))
    .catch(err => Promise.reject({
      errors: {
        emailVerification: 'SEND_VERIFICATION_EMAIL_FAILED'
      }
    }))
}

function sendVerificationEmail(mailer, user, emailType) {
  return new Promise((resolve, reject) => {
    if (!user) {
      return reject({ message: 'user not exists' })
    }
    if (!emailType) {
      return reject({ message: 'unknown verification email type' })
    }
    // resend spam prevention
    if (user.emailVerificationTokenCreated && emailType === verificationEmailTypes.RESEND) {
      const secondsDiff = (new Date() - user.emailVerificationTokenCreated) / 1000;
      if (secondsDiff <= config.spamIntervals.resendVerificationEmail) {
        return reject({
          errors: {
            emailVerification: 'RESEND_VERIFICATION_EMAIL_SPAM',
            until: new Date(user.emailVerificationTokenCreated.getTime() + config.spamIntervals.resendVerificationEmail * 1000)
          }
        });
      }
    }
    const shouldNotCreateNewToken = user.lastVerifiedEmail && emailType === verificationEmailTypes.REVERIFY
    const emailVerificationToken = shouldNotCreateNewToken ? user.getExistingEmailVerificationToken() : user.getEmailVerificationToken()
    const to = emailType === verificationEmailTypes.ROLLBACK ? user.lastVerifiedEmail : user.email;

    if (process.env.NODE_ENV !== 'test') {
      getTemplate(mailer, emailType)
        .then(templateData => {
          const extraUrl = emailType === verificationEmailTypes.ROLLBACK ? 'rollback/' : '';
          const emailVerificationUrl = config.applicationUrl + '/verification/email/' + extraUrl + emailVerificationToken
          templateData.template = templateData.template.replace('{{emailVerificationUrl}}', emailVerificationUrl)
          templateData.template = templateData.template.replaceAll('{{applicationName}}', config.applicationName)
          templateData.template = templateData.template.replaceAll('{{name}}', user.name)

          const mailOptions = {
            to: to,
            subject: templateData.subject,
            html: templateData.template
          };
          if (shouldNotCreateNewToken) {
            return sendMail(mailer, mailOptions).then(resolve).catch(reject)
          } else {
            return user.save()
              .then(() => sendMail(mailer, mailOptions))
              .then(resolve)
              .catch(err => reject({ message: 'user update failed'}))
          }
        })
        .catch(reject)
    } else {
      mockSendMail(user, shouldNotCreateNewToken, emailVerificationToken, to, emailType).then(resolve).catch(reject)
    }
  })
}

module.exports = { sendVerificationEmail, checkIsEmailVerified, verificationEmailTypes }
