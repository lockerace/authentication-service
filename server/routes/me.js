function getMe(req, res) {
	return res.jsonp({
		email: req.me.email,
		name: req.me.name,
		roles: req.me.roles
	}).end();
}

module.exports = getMe;
