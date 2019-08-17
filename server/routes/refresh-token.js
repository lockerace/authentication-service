const {verifyRefreshToken} = require('../../helpers/tokens');

function refreshToken(req, res) {
	return verifyRefreshToken(req.category, req.body.refreshToken).then(() => {
		return res.json({
			payload: {
				user: req.category,
				token: req.category.getToken(),
				refreshToken: req.category.getRefreshToken(),
			}
		});
	});
}

module.exports = refreshToken;
