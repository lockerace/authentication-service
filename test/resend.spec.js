const common = require('./common');

module.exports = () => {
  return describe('POST /api/verification/email/resend', function() {
    it('should report email already verified', function(done) {
      const data = {
        email: common.state.adminUser.email
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email/resend')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          res.body.errors.should.have.property('emailVerification')
          res.body.errors.should.have.property('emailVerification').eql('EMAIL_ALREADY_VERIFIED')
          done(err)
        })
    })
    it('should return verification token', function(done) {
      const spamInterval = process.env.RESEND_VERIFICATION_EMAIL_INTERVAL * 1000
      this.timeout(spamInterval + 1000)
      // wait resend spam interval
      setTimeout(() => {
        const data = {
          email: common.state.email1
        }
        common.chai.request(common.state.server)
          .post('/api/verification/email/resend')
          .send(data)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('emailVerificationToken');
            common.state.emailVerificationToken = res.body.emailVerificationToken;
            done(err)
          })
      }, spamInterval)
    })
    it('should report resend verification email spam', function(done) {
      const data = {
        email: common.state.email1
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email/resend')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('emailVerification')
          res.body.errors.should.have.property('emailVerification').eql('RESEND_VERIFICATION_EMAIL_SPAM')
          done(err)
        })
    })
  })
}
