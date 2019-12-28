const common = require('./common');

module.exports = () => {
  return describe('POST /api/signup', function() {
    it('should create user with name testuser', function(done) {
      const data = {
        email: common.state.email1,
        name: 'testuser',
        password: '12345678'
      }
      common.chai.request(common.state.server)
        .post('/api/signup')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('emailVerificationToken');
          res.body.should.have.property('id');
          common.state.userId = res.body.id
          done(err)
        })
    });
    it('should report duplicate email error', function(done) {
      const data = {
        email: common.state.email1,
        name: 'testuser',
        password: '12345678'
      }
      common.chai.request(common.state.server)
        .post('/api/signup')
        .send(data)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('email');
          res.body.errors.should.have.property('email').eql('DUPLICATED_EMAIL');
          done(err)
        })
    });
  })
}
