const common = require('./common');

module.exports = () => {
  return describe('POST /api/verification/email', function() {
    it('should report invalid token', function(done) {
      const data = {
        token: 'asdqwezxc'
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email')
        .send(data)
        .end((err, res) => {
          res.should.have.status(401)
          res.body.should.be.a('object')
          res.body.should.have.property('message');
          done(err)
        })
    })
    it('should verify email', function(done) {
      const data = {
        token: common.state.emailVerificationToken
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          done(err)
        })
    })
    it('should report email already verified', function(done) {
      const data = {
        token: common.state.emailVerificationToken
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('emailVerification');
          res.body.errors.should.have.property('emailVerification').eql('EMAIL_ALREADY_VERIFIED');
          done(err)
        })
    })
  })
}
