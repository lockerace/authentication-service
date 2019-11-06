const User = require('mongoose').model('User')

function getUser (req, res) {
  const isPrivileged = !!req.user.isPrivileged

  return User.findById(req.params.userId)
    .select(isPrivileged ? 'email name roles' : 'name')
    .lean()
    .then(user => {
      if (!user) {
        return Promise.reject(null)
      }
      return res.status(200).jsonp(user).end()
    })
    .catch(() => res.status(404).jsonp({ message: 'user not exists' }).end())
}

module.exports = getUser
