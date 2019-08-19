function getMe(req, res) {
	return res.jsonp({
		email: req.user.email,
		name: req.user.name,
		roles: req.user.roles
	}).end();
}

module.exports = getMe;
