function onlyAuthenticated (req, res, next) {
  if (!req.user) {
    return res.status(401).jsonp({ message: 'you are not authorized' }).end()
  }
  next();
}

module.exports = {
  onlyAuthenticated,
}
