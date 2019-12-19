const roles = process.env.ROELS ? process.env.ROELS.split(',') : ['user', 'admin'];
const privilegedRoles = process.env.PRIVILEGED_ROLES ? process.env.PRIVILEGED_ROLES.split(',') : ['admin'];

module.exports = {
	mongoUri: process.env.MONGO_URI || "mongodb://localhost/auth-service",
	jwtSecret: process.env.JWT_SECRET || "abcddddd",
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "a secret 2 phrase!!",
	tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
	refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '14d',
	emailVerificationTokenExpiration: process.env.EMAIL_VERIFICATION_TOKEN_EXPIRATION || '1h',
	roles,
	privilegedRoles,
	defaultRole: process.env.DEFAULT_ROLE ? process.env.DEFAULT_ROLE : roles[0],
	emailVerificationUrl: process.env.EMAIL_VERIFICATION_URL || "http://localhost:" + (process.env.PORT || 3000) + "/verification/email",
	mailProvider: {
		service: process.env.MAIL_PROVIDER_SERVICE,
		email: process.env.MAIL_PROVIDER_EMAIL,
		authType: process.env.MAIL_PROVIDER_AUTH_TYPE,
		password: process.env.MAIL_PROVIDER_PW
	}
};
