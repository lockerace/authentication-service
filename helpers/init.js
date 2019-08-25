/**
 * this file used to initiate basic data inside the authentication service
 */
const config = require('../config');
require('../server/models').connect(config.mongoUri);
const User = require('mongoose').model('User');

const user = new User({
	email: 'test@test.com',
	name: 'Administrator',
	password: 'admin',
	roles: [config.privilegedRoles[0]],
});

user.save().then(() => {
	console.log('admin created successfully');
	process.exit(0);
});