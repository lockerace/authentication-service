const User = require('mongoose').model('User')
const { isObjectId } = require('../../helpers/mongo-utils')

function getUsers (req, res) {
  const isPrivileged = !!(req.user && req.user.isPrivileged)

  const users = (req.query.users || '')
    .split(',')
    .map(id => id.trim())
    .filter(id => isObjectId(id))

  if (!(isPrivileged || users.length)) {
    return res.status(200).jsonp([]).end()
  }
  return User.find(isPrivileged && !users.length ? {} : { _id: { $in: users } })
    .select(isPrivileged ? 'email name roles' : 'name')
    .lean()
    .then(users => {
      return res.status(200).jsonp(users || []).end()
    })
    .catch(() => res.status(404).jsonp({ message: 'could not load users' }).end())
}

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

function updateUser (req, res) {
  const body = req.body || {}

  User.findById(req.params.userId)
    .then(user => {
      return Object.assign(user, body).save()
    })
    .then(({ email, name, roles }) => {
      return res.status(200).jsonp({ email, name, roles }).end()
    })
    .catch(() => res.status(400).jsonp({ message: 'user update failed' }).end())
}

module.exports = { getUsers, updateUser, getUser }
