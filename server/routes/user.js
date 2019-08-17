const User = require('mongoose').model('User');

function getUser(req, res) {
	return User.findById(req.params.userId)
		.then(user => {
			if (!user) {
				return Promise.reject(null);
			}
			return res.status(200).jsonp({name: user.name}).end();
		})
		.catch(() => res.status(404).jsonp({message: 'user not exists'}).end());
}

module.exports = getUser;
