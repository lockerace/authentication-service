/**
 * this file used to initiate basic data inside the authentication service
 */
const config = require('../config');
const User = require('mongoose').model('User');

// connect to the database and load models
require('../server/models').connect(config.mongoUri);

const user = new User({
	email: 'test@test.com',
	name: 'Administrator',
	password: 'admin',
	roles: [config.privilegedRoles[0]],
});

user.save()
	.then(() => console.log('admin created successfully'));