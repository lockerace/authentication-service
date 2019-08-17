function initiatePassport(app) {
	const passport = require('passport');

	// pass the passport middleware
	app.use(passport.initialize({}));

// load passport strategies
	passport.use('local-signup', require('./local-signup'));
	passport.use('local-login', require('./local-login'));
}

module.exports = initiatePassport;