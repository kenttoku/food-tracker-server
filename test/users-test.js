const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGODB_URI } = require('../config');

const User = require('../models/user-model');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Food Tracker API - Users', function() {
  const username = 'exampleUser';
  const password = 'examplePass';

  before(function() {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function() {
    return User.createIndexes();
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('/api/users', function() {
    describe('POST', function() {
      it('Should create a new user', function() {
        const testUser = { username, password };

        let res;
        return chai
          .request(app)
          .post('/api/users')
          .send(testUser)
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username');

            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(testUser.username);

            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });


      it('Should reject users with missing username', function() {
        const testUser = { password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with missing password', function() {
        const testUser = { username };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      });


      it('Should reject users with non-string username', function() {
        const testUser = { username: 123456, password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with non-string password', function() {
        const testUser = { username, password: 123456 };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with non-trimmed username', function() {
        const testUser = { username: username + '  ', password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with non-trimmed password', function() {
        const testUser = { username, password: password + '  ' };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with empty username', function() {
        const testUser = { username: '', password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 1 characters long');
            expect(res.body.location).to.equal('username');
          });
      });
      it('Should reject users with password less than 8 characters', function() {
        const testUser = { username, password: 'short' };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 8 characters long');
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with password greater than 72 characters', function() {
        const longPassword = password.padEnd(73, 'a');
        const testUser = { username, password: longPassword };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at most 72 characters long');
            expect(res.body.location).to.equal('password');
          });
      });
      it('Should reject users with duplicate username', function() {
        const testUser = { username, password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(() => {
            return chai.request(app).post('/api/users').send(testUser);
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal('The username already exists');
          });

      });

    });
  });
});
