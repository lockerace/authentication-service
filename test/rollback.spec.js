const common = require('./common');

module.exports = () => {
  return describe('POST /api/verification/email/rollback', function() {
    it('should report invalid token', function(done) {
      const data = {
        token: 'asdqwezxc'
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email/rollback')
        .send(data)
        .end((err, res) => {
          res.should.have.status(401)
          res.body.should.be.a('object')
          res.body.should.have.property('message');
          done(err)
        })
    })
    it('should rollback email', function(done) {
      const data = {
        token: common.state.emailVerificationToken
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email/rollback')
        .send(data)
        .end((errRollback, resRollback) => {
          resRollback.should.have.status(200)
          resRollback.body.should.be.a('object')
          common.chai.request(common.state.server)
            .get('/api/users/' + common.state.userId)
            .set('Authorization', 'Bearer ' + common.state.adminToken)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('email');
              res.body.should.have.property('email').eql(common.state.email1);
              done(errRollback || err)
            })
        })
    })
    it('should report rollback failed when using same token', function(done) {
      const data = {
        token: common.state.emailVerificationToken
      }
      common.chai.request(common.state.server)
        .post('/api/verification/email/rollback')
        .send(data)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('message');
          done(err)
        })
    })
    it('should report cannot reverify email', function(done) {
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
