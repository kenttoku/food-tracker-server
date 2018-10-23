const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const app = require('../index');
const User = require('../models/user-model');
const Food = require('../models/food-model');
const Diary = require('../models/diary-model');

const { food, diaries, users } = require('../db/data');
const { TEST_MONGODB_URI, JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('Food Tracker API - Diaries', () => {
  let user;
  let token;
  before(() => {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => Food.createIndexes());
  });

  beforeEach(() => {
    return Promise.all([
      User.insertMany(users),
      Food.insertMany(food),
      Diary.insertMany(diaries)
    ])
      .then(([users]) => {
        user = users[0].serialize();
        token = jwt.sign({ user }, JWT_SECRET, {
          subject: user.username,
          expiresIn: '1m',
          algorithm: 'HS256'
        });
      });
  });

  afterEach(() => {
    sandbox.restore();
    return Promise.all([
      Diary.deleteMany(),
      Food.deleteMany(),
      User.deleteMany()
    ]);
  });

  after(() => {
    return mongoose.connection.db.dropDatabase()
      .then(() => mongoose.disconnect());
  });

  describe('GET /api/diaries', () => {
    it('should return a list of diaries', () => {
      return Promise.all([
        Diary.find({ userId: user.id }),
        chai.request(app).get('/api/diaries')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should catch errors and respond properly', () => {
      sandbox.stub(Diary.schema.options.toJSON, 'transform').throws('FakeError');
      return chai.request(app).get('/api/diaries')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });

  describe('GET /api/diary/:yyyymmdd', () => {
    it('should get the correct diary', () => {
      let data;
      return Diary.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/diaries/${data.yyyymmdd}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('id', 'yyyymmdd', 'entries', 'userId', 'points', 'combined');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(res.body.yyyymmdd).to.equal(data.yyyymmdd);
          expect(res.body.userId).to.equal(data.userId.toString());
        });
    });

    it('should create a new diary if it does not exist', () => {
      return chai.request(app).get('/api/diaries/20000101')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys('id', 'yyyymmdd', 'entries', 'userId', 'points', 'combined');
        });
    });


    it('should catch errors and respond properly', () => {
      sandbox.stub(Diary.schema.options.toJSON, 'transform').throws('FakeError');
      return chai.request(app).get('/api/diaries/20000101')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });

  });

  describe('PATCH /api/diaries/:yyyymmdd', () => {
    it('should update an item', () => {
      const updateField = { entries: [] };
      let data;
      return Diary.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app)
            .patch(`/api/diaries/${data.yyyymmdd}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateField);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.all.keys('id', 'yyyymmdd', 'entries', 'userId', 'points', 'combined');
          expect(res.body.id).to.equal(data.id);
          expect(res.body.userId).to.equal(data.userId.toString());
          expect(res.body.entries).to.be.empty;
        });
    });

    it('should catch errors and respond properly', () => {
      sandbox.stub(Diary.schema.options.toJSON, 'transform').throws('FakeError');
      const updateField = { entries: [] };
      let data;
      return Diary.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app)
            .patch(`/api/diaries/${data.yyyymmdd}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateField);
        })
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });

});