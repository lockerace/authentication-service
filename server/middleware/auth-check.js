const {verifyToken} = require('../../helpers/tokens');


/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).end();
	}

	// get the last part from a authorization header string like "bearer token-value"
	const token = req.headers.authorization.split(' ')[1];

	return verifyToken(token)
		.then(user => {
			// pass user details onto next route
			req.user = user;
			return next();
		})
		.catch(() => {
			return res.status(401).end();
		});
};
