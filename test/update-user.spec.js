const common = require('./common');

module.exports = () => {
  return describe('PUT /api/users/:userId', function() {
    it('should change email', function(done) {
      const data = {
        email: common.state.email2
      }
      common.chai.request(common.state.server)
        .put('/api/users/' + common.state.userId)
        .set('Authorization', 'Bearer ' + common.state.adminToken)
        .send(data)
        .end((errUpdate, resUpdate) => {
          resUpdate.should.have.status(200)
          resUpdate.body.should.be.a('object')
          resUpdate.body.should.have.property('email');
          resUpdate.body.should.have.property('email').eql(common.state.email2);
          resUpdate.body.should.have.property('reverifyEmailStatus');
          resUpdate.body.reverifyEmailStatus.should.have.property('emailVerificationToken');

          common.state.emailVerificationToken = resUpdate.body.reverifyEmailStatus.emailVerificationToken
          common.chai.request(common.state.server)
            .get('/api/users/' + common.state.userId)
            .set('Authorization', 'Bearer ' + common.state.adminToken)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('email');
              res.body.should.have.property('email').eql(common.state.email2);
              done(errUpdate || err)
            })
        })
    })

    it('should report change email spam', function(done) {
      const data = {
        email: common.state.email3
      }
      common.chai.request(common.state.server)
        .put('/api/users/' + common.state.userId)
        .set('Authorization', 'Bearer ' + common.state.adminToken)
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('');
          res.body.errors.should.have.property('').eql('CHANGE_EMAIL_SPAM');
          done(err)
        })
    })

    it('should reverify email', function(done) {
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

  })
}
