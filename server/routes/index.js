
function routes(app) {
	const authCheck = require('../middleware/auth-check');

	app
		.post('/api/signin', require('./signin'))
		.post('/api/signup', require('./signup'))
		.post('/api/token/refresh', authCheck, require('./refresh-token'))
		.post('/api/me', authCheck, require('./me'))
		.get('/api/users/:userId', require('./user'));
}

module.exports = routes;