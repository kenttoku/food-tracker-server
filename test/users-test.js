const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_MONGODB_URI, JWT_SECRET } = require('../config');

const User = require('../models/user-model');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Food Point API - Users', () => {
  const username = 'exampleUser';
  const password = 'examplePass';

  const anotherUser = 'anotherUser';
  const anotherPass = 'anotherPass';
  const _id = '000000000000000000000001';

  before(() => {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(() => {
    return User.createIndexes()
      .then(() => {
        return User.hashPassword(anotherPass)
          .then(digest => User.create({
            _id,
            username: anotherUser,
            password: digest
          }));
      });
  });

  afterEach(() => {
    return mongoose.connection.db.dropDatabase();
  });

  after(() => {
    return mongoose.disconnect();
  });

  describe('/api/users', () => {
    describe('POST', () => {
      it('Should create a new user', () => {
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

      it('Should reject users with missing username', () => {
        const testUser = { password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with missing password', () => {
        const testUser = { username };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with non-string username', () => {
        const testUser = { username: 123456, password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with non-string password', () => {
        const testUser = { username, password: 123456 };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with non-trimmed username', () => {
        const testUser = { username: username + '  ', password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with non-trimmed password', () => {
        const testUser = { username, password: password + '  ' };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with empty username', () => {
        const testUser = { username: '', password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 1 characters long');
            expect(res.body.location).to.equal('username');
          });
      });

      it('Should reject users with password less than 8 characters', () => {
        const testUser = { username, password: 'short' };
        return chai.request(app).post('/api/users').send(testUser)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 8 characters long');
            expect(res.body.location).to.equal('password');
          });
      });

      it('Should reject users with password greater than 72 characters', () => {
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

      it('Should reject users with duplicate username', () => {
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

    describe('PATCH', () => {
      it('should change username', () => {
        return chai.request(app)
          .patch('/api/users')
          .send({
            username: anotherUser,
            password: anotherPass,
            newUsername: 'newUserName'
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.authToken).to.be.a('string');

            const payload = jwt.verify(res.body.authToken, JWT_SECRET);

            expect(payload.user).to.not.have.property('password');
            expect(payload.user.id).to.equal(_id);
            expect(payload.user.username).to.equal('newUserName');
          });
      });

      it('should not change username if there is a duplicate', () => {
        const testUser = { username, password };
        return chai.request(app).post('/api/users').send(testUser)
          .then(() => {
            return chai.request(app)
              .patch('/api/users')
              .send({
                username: anotherUser,
                password: anotherPass,
                newUsername: username
              });
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal('The username already exists');
          });
      });

      it('should throw an error for missing newUsername field', () => {
        return chai.request(app)
          .patch('/api/users')
          .send({
            username: anotherUser,
            password: anotherPass,
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.equal('Missing `newUsername` in request body');
          });
      });
    });
  });
});
