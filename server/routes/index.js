
function routes(app) {
	const authCheck = require('../middleware/auth-check');

	app
		.post('/api/signin', require('./signin'))
		.post('/api/signup', require('./signup'))
		.post('/api/token/refresh', require('./refresh-token'))
		.get('/api/me', authCheck, require('./me'))
		.get('/api/users', require('./users'))
		.get('/api/users/:userId', require('./user'));
}

module.exports = routes;
