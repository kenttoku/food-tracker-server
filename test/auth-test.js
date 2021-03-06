const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../index');

const { TEST_MONGODB_URI, JWT_SECRET } = require('../config');

const User = require('../models/user-model');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Food Point API - Auth', () => {
  let token;
  const _id = '000000000000000000000001';
  const username = 'exampleUser';
  const password = 'examplePass';

  before(() => mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true }));

  beforeEach(() => User.hashPassword(password)
    .then(digest => User.create({
      _id,
      username,
      password: digest,
    })));

  afterEach(() => User.deleteMany());

  after(() => mongoose.connection.db.dropDatabase()
    .then(() => mongoose.disconnect()));

  describe('Food Point /api/auth/login', () => {
    it('Should return a valid auth token', () => chai.request(app)
      .post('/api/auth/login')
      .send({ username, password })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.authToken).to.be.a('string');

        const payload = jwt.verify(res.body.authToken, JWT_SECRET);

        expect(payload.user).to.not.have.property('password');
        expect(payload.user.id).to.equal(_id);
        expect(payload.user.username).to.deep.equal(username);
      }));

    it('Should reject requests without credentials', () => chai.request(app)
      .post('/api/auth/login')
      .send({})
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Bad Request');
      }));

    it('Should reject requests with empty string username', () => chai.request(app)
      .post('/api/auth/login')
      .send({ username: '', password })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Bad Request');
      }));

    it('Should reject requests with empty string password', () => chai.request(app)
      .post('/api/auth/login')
      .send({ username, password: '' })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Bad Request');
      }));

    it('Should reject requests with incorrect username', () => chai.request(app)
      .post('/api/auth/login')
      .send({ username: 'wrongUsername', password: 'password' })
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Unauthorized');
      }));

    it('Should reject requests with incorrect password', () => chai.request(app)
      .post('/api/auth/login')
      .send({ username, password: 'wrongpass' })
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('Unauthorized');
      }));
  });

  describe('/api/auth/refresh', () => {
    it('should reject requests with no credentials', () => chai.request(app)
      .post('/api/auth/refresh')
      .then((res) => {
        expect(res).to.have.status(401);
      }));

    it('should reject requests with an invalid token', () => {
      token = jwt.sign({ username, password }, 'Incorrect Secret');
      return chai.request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(401);
        });
    });

    it('should reject requests with an expired token', () => {
      token = jwt.sign({ username, password }, JWT_SECRET, { subject: username, expiresIn: Math.floor(Date.now() / 1000) - 10 });
      return chai.request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(401);
        });
    });

    it('should return a valid auth token with a newer expiry date', () => {
      const user = { username };
      const token = jwt.sign({ user }, JWT_SECRET, { subject: username, expiresIn: '1m' });
      const decoded = jwt.decode(token);

      return chai.request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.been.a('object');
          const authToken = res.body.authToken;
          expect(authToken).to.be.a('string');

          const payload = jwt.verify(authToken, JWT_SECRET);
          expect(payload.user).to.deep.equal({ username });
          expect(payload.exp).to.be.greaterThan(decoded.exp);
        });
    });
  });
});
