const common = require('./common');

module.exports = () => {
  return describe('POST /api/signin', function() {
    it('should report email verification required', function(done) {
      const data = {
        email: common.state.email1,
        password: '12345678'
      }
      common.chai.request(common.state.server)
        .post('/api/signin')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('');
          res.body.errors[''].should.have.property('code');
          res.body.errors[''].should.have.property('code').eql('EMAIL_VERIFICATION_REQUIRED');
          done(err)
        })
    });
    it('should report incorrect credentials', function(done) {
      const data = {
        email: common.state.adminUser.email,
        password: '1234'
      }
      common.chai.request(common.state.server)
        .post('/api/signin')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('password');
          res.body.errors.password.should.have.property('code');
          res.body.errors.password.should.have.property('code').eql('INCORRECT_CREDENTIALS');
          done(err)
        })
    });
    it('should provide access token', function(done) {
      const data = {
        email: common.state.adminUser.email,
        password: 'admin'
      }
      common.chai.request(common.state.server)
        .post('/api/signin')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('payload');
          res.body.payload.should.have.property('token');
          res.body.payload.should.have.property('refreshToken');
          res.body.payload.should.have.property('user');
          res.body.payload.user.should.have.property('email');
          res.body.payload.user.should.have.property('email').eql(common.state.adminUser.email);
          common.state.adminToken = res.body.payload.token
          done(err)
        })
    });
  })
}
