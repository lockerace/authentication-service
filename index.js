String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const initiatePassport = require('./server/passport');
const config = require('./config');
const routes = require('./server/routes');
const initiateMailer = require('./helpers/mailer');

// connect to the database and load models
require('./server/models').connect(config.mongoUri);

const app = express();
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(cors());

// tell the app to parse HTTP body messages
app.use(bodyParser.json());

// load passport strategies
initiatePassport(app);
if (process.env.NODE_ENV !== 'test') {
  initiateMailer(app)
  	.then(routes)
  	.then(() => {
  		app.set('port', (process.env.PORT || 8000));
  		app.set('ip', (process.env.IP || '0.0.0.0'));

  		// start the server
      app.listen(app.get('port'), app.get('ip'), () => {
        console.log(`Auth Server is running on port ${app.get('port')}`);
      });
    })
} else {
  const appPromise = initiateMailer(app)
  	.then(routes)
  	.then(() => app);

  module.exports = appPromise
}
