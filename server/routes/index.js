function routes (app) {
  const populateUser = require('../middleware/populate-user')
  const { onlyAuthenticated, onlyPrivileged } = require('../middleware/auth-check')

  const { getUsers, updateUser, getUser } = require('./users')

  app
    .post('/api/signin', require('./signin'))
    .post('/api/signup', require('./signup'))
    .post('/api/token/refresh', require('./refresh-token'))
    .get('/api/me', populateUser, onlyAuthenticated, require('./me'))
    .get('/api/users', populateUser, getUsers)
    .get('/api/users/:userId', getUser)
    .put('/api/users/:userId', populateUser, onlyPrivileged, updateUser)
}

module.exports = routes
