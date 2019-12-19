const config = require('../config')
const nodemailer = require('nodemailer')

function sendEmail(mailOptions) {
  return new Promise((resolve, reject) => {
    if (!mailOptions) {
      return reject({ message: 'mailOptions required' })
    }
    const smtpOptions = {
      service: config.mailProvider.service
    }
    if (config.mailProvider.authType == 'basic') {
      smtpOptions.auth = {
        user: config.mailProvider.email,
        pass: config.mailProvider.password
      }
    } else {
      // TODO other email authentication
      throw new Error('not_implemented_yet')
    }
    const smtpTransport = nodemailer.createTransport(smtpOptions)

    mailOptions.from = config.mailProvider.email

    return smtpTransport.sendMail(mailOptions, (err, info) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

module.exports = sendEmail
