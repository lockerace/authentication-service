function routes (app) {
  const populateUser = require('../middleware/populate-user')
  const { onlyAuthenticated, onlyPrivileged } = require('../middleware/auth-check')

  const { getUsers, updateUser, getUser } = require('./users')
  const { handleEmailVerificationRequest, verifyEmail } = require('./email-verification.js')

  app
    .post('/api/signin', require('./signin'))
    .post('/api/signup', require('./signup'))
    .post('/api/token/refresh', require('./refresh-token'))
    .post('/api/verification/email', verifyEmail)
    .get('/api/me', populateUser, onlyAuthenticated, require('./me'))
    .get('/api/users', populateUser, getUsers)
    .get('/api/users/:userId', populateUser, getUser)
    .get('/api/verification/email/resend', populateUser, onlyAuthenticated, handleEmailVerificationRequest)
    .put('/api/users/:userId', populateUser, onlyPrivileged, updateUser)
}

module.exports = routes
