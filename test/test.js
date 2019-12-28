process.env.NODE_ENV = 'test';
process.env.RESEND_VERIFICATION_EMAIL_INTERVAL = 1;
process.env.CHANGE_EMAIL_INTERVAL = 1

const config = require('../config')
require('../server/models').connect(config.mongoUri);
const common = require('./common');
const chaiHttp = require('chai-http');
const { init, reset } = require('../helpers/init-util')

const should = common.chai.should();
common.chai.use(chaiHttp);

common.state = {
  email1: 'test1@test.com',
  email2: 'test2@test.com',
  email3: 'test3@test.com',
  adminUser: null,
  server: null,
  emailVerificationToken: null,
  adminToken: null,
  userId: null,
}

describe('Auth', function() {
  before(function(done) {
    require('../index').then(loadedServer => {
      common.state.server = loadedServer
      reset()
        .then(init)
        .then((admin) => {
          common.state.adminUser = admin
          done()
        })
    })
  })
  require('./signup.spec')()
  require('./signin.spec')()
  require('./resend.spec')()
  require('./verify.spec')()
  require('./update-user.spec')()
  require('./rollback.spec')()
  require('./disable-rollback.spec')()
});
