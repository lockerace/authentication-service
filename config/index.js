const roles = process.env.ROELS ? process.env.ROELS.split(',') : ['user'];

module.exports = {
	mongoUri: process.env.MONGO_URI || "mongodb://localhost/auth-service",
	jwtSecret: process.env.JWT_SECRET || "a secret phrase!!",
	refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "a secret 2 phrase!!",
	roles,
	defaultRole: process.env.DEFAULT_ROLE ? process.env.DEFAULT_ROLE : roles[0],
};
