const jwt = require('jsonwebtoken');
const User = require('mongoose').model('User');
const config = require('../config');

function verifyToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, config.jwtSecret, (err, decoded) => {
			if (err) {
				// the 401 code is for unauthorized status
				reject(err);
			}

			const userId = decoded.sub;

			// check if a user exists
			return User.findById(userId, (userErr, user) => {
				if (userErr || !user && user.tokenCreated === (new Date(decoded.created))) {
					return reject();
				}
				resolve(user);
			});
		});
	});
}

function verifyRefreshToken(user, refreshToken) {
	return new Promise((resolve, reject) => {
		jwt.verify(refreshToken, config.refreshTokenSecret, (err, decoded) => {
			if (err) {
				// the 401 code is for unauthorized status
				reject(err);
			}

			const userId = decoded.sub;

			if (user._id.toString() === userId && user.refreshTokenCreated === (new Date(decoded.created))) {
				resolve(user);
			} else {
				reject();
			}

		});
	});
}

module.exports = {
	verifyToken,
	verifyRefreshToken
};