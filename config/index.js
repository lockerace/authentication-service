const roles = process.env.ROELS ? process.env.ROELS.split(',') : ['user', 'admin'];
const privilegedRoles = process.env.PRIVILEGED_ROLES ? process.env.PRIVILEGED_ROLES.split(',') : ['admin'];

module.exports = {
	mongoUri: process.env.MONGO_URI || "mongodb://localhost/auth-service",
	jwtSecret: process.env.JWT_SECRET || "abcddddd",
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "a secret 2 phrase!!",
	tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
	refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '14d',
	roles,
	privilegedRoles,
	defaultRole: process.env.DEFAULT_ROLE ? process.env.DEFAULT_ROLE : roles[0],
};
