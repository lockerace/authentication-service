const mongoose = require('mongoose');

module.exports.connect = (uri) => {
	if (process.env.NODE_ENV === 'test') {
		mongoose.set('useCreateIndex', true);
		mongoose.set('useUnifiedTopology', true);
		mongoose.set('useNewUrlParser', true);
		mongoose.connect(uri);
	} else {
		mongoose.connect(uri, {useMongoClient: true});
	}

	// plug in the promise library:
	mongoose.Promise = global.Promise;


	mongoose.connection.on('error', (err) => {
		console.error(`Mongoose connection error: ${err}`);
		process.exit(1);
	});

	// load models
	require('./user');
};
