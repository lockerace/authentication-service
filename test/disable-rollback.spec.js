const common = require('./common')

module.exports = () => {
  return describe('POST /api/users/:userId/disable-rollback', function() {
    it('should report email rollback already disabled', function(done) {
      common.chai.request(common.state.server)
        .post('/api/users/' + common.state.userId + '/disable-rollback')
        .set('Authorization', 'Bearer ' + common.state.adminToken)
        .send({})
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('errors')
          res.body.errors.should.have.property('')
          res.body.errors.should.have.property('').eql('EMAIL_ROLLBACK_ALREADY_DISABLED')
          done(err)
        })
    })
    it('should report disable email rollback', function(done) {
      const spamInterval = process.env.CHANGE_EMAIL_INTERVAL * 1000
      this.timeout(spamInterval + 1000)
      // wait change email spam interval
      setTimeout(() => {
        const data = {
          email: common.state.email3
        }
        common.chai.request(common.state.server)
          .put('/api/users/' + common.state.userId)
          .set('Authorization', 'Bearer ' + common.state.adminToken)
          .send(data)
          .end((errUpdate, resUpdate) => {
            resUpdate.should.have.status(200)
            resUpdate.body.should.be.a('object')
            resUpdate.body.should.have.property('email')
            resUpdate.body.should.have.property('email').eql(common.state.email3)
            common.chai.request(common.state.server)
              .post('/api/users/' + common.state.userId + '/disable-rollback')
              .set('Authorization', 'Bearer ' + common.state.adminToken)
              .send({})
              .end((errDisable, resDisable) => {
                resDisable.should.have.status(200)
                resDisable.body.should.be.a('object')
                common.chai.request(common.state.server)
                  .get('/api/users/' + common.state.userId)
                  .set('Authorization', 'Bearer ' + common.state.adminToken)
                  .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('lastVerifiedEmail')
                    res.body.should.have.property('lastVerifiedEmail').eql(null)
                    done(errUpdate || errDisable || err)
                  })
              })
          })
      }, spamInterval)
    })
    it('should report not authorized', function(done) {
      common.chai.request(common.state.server)
        .post('/api/users/' + common.state.userId + '/disable-rollback')
        .set('Authorization', 'Bearer asd')
        .send({})
        .end((err, res) => {
          res.should.have.status(401)
          res.body.should.be.a('object')
          res.body.should.have.property('message')
          res.body.should.have.property('message').eql('you are not authorized')
          done(err)
        })
    })
  })
}
