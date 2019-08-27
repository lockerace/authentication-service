const {verifyRefreshToken} = require('../../helpers/tokens');

function refreshToken(req, res) {
	if (!req.headers.authorization) {
		return res.status(401).end();
	}

	// get the last part from a authorization header string like "bearer token-value"
	const token = req.headers.authorization.split(' ')[1];

	return verifyRefreshToken(token).then((user) => {
		req.user = user;
		const token = req.user.getToken();
		const refreshToken = req.user.getRefreshToken();

		return req.user.save().then(() => {
			return res.json({
				payload: {
					user: {
						email: req.user.email,
						name: req.user.name,
						roles: req.user.roles,
					},
					token,
					refreshToken,
				}
			});
		});
	});
}

module.exports = refreshToken;
