const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
const sinon = require('sinon');

const app = require('../index');
const User = require('../models/user-model');
const Food = require('../models/food-model');

const { food, users } = require('../db/data');
const { TEST_MONGODB_URI, JWT_SECRET } = require('../config');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

describe('Food Tracker API - Food', () => {
  let user;
  let token;
  before(() => {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => Food.createIndexes());
  });

  beforeEach(() => {
    return Promise.all([
      User.insertMany(users),
      Food.insertMany(food)
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
      Food.deleteMany(),
      User.deleteMany()
    ]);
  });

  after(() => {
    return mongoose.connection.db.dropDatabase()
      .then(() => mongoose.disconnect());
  });

  describe('GET /api/food', () => {
    it('should return a list of food', () => {
      return Promise.all([
        Food.find({ userId: user.id }).sort({ updatedAt: 'desc' }),
        chai.request(app).get('/api/food')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach((item, i) => {
            expect(item).to.be.an('object');
            expect(item).to.have.all.keys(
              'id',
              'name',
              'userId',
              'fruits',
              'vegetables',
              'wholeGrains',
              'leanProteins',
              'nutsAndSeeds',
              'dairy',
              'refinedGrains',
              'fattyProteins',
              'sweets',
              'friedFoods',
              'createdAt',
              'updatedAt'
            );
            expect(item.id).to.equal(data[i].id);
            expect(item.name).to.equal(data[i].name);
            expect(item.userId).to.equal(data[i].userId.toString());
            expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
            expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
          });
        });
    });

    it('should catch errors and respond properly', () => {
      sandbox.stub(Food.schema.options.toJSON, 'transform').throws('FakeError');

      return chai.request(app).get('/api/food')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });

  describe('GET /api/food/:id', () => {
    it('should get the correct food', () => {
      let data;
      return Food.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/food/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys(
            'id',
            'name',
            'userId',
            'fruits',
            'vegetables',
            'wholeGrains',
            'leanProteins',
            'nutsAndSeeds',
            'dairy',
            'refinedGrains',
            'fattyProteins',
            'sweets',
            'friedFoods',
            'createdAt',
            'updatedAt'
          );
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          expect(res.body.userId).to.equal(data.userId.toString());
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.eql(data.updatedAt);
        });
    });


    it('should not return for invalid id', () => {
      return Food.findOne({ userId: user.id })
        .then(() => {
          return chai.request(app).get('/api/food/INVALID')
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });


    it('should catch errors and respond properly', () => {
      sandbox.stub(Food.schema.options.toJSON, 'transform').throws('FakeError');

      let data;
      return Food.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/food/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });

  describe('POST /api/food', () => {
    it('should create a new item', () => {
      const newItem = { name: 'newFood' };
      let body;
      return chai.request(app)
        .post('/api/food')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then((res) => {
          body = res.body;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(body).to.be.an('object');
          expect(res.body).to.have.all.keys(
            'id',
            'name',
            'userId',
            'fruits',
            'vegetables',
            'wholeGrains',
            'leanProteins',
            'nutsAndSeeds',
            'dairy',
            'refinedGrains',
            'fattyProteins',
            'sweets',
            'friedFoods',
            'createdAt',
            'updatedAt'
          );
          return Food.findOne({ _id: body.id, userId: user.id });
        })
        .then(data => {
          expect(body.id).to.equal(data.id);
          expect(body.name).to.equal(data.name);
          expect(body.userId).to.equal(data.userId.toString());
          expect(new Date(body.createdAt)).to.eql(data.createdAt);
          expect(new Date(body.updatedAt)).to.eql(data.updatedAt);
        });
    });

    it('should throw an error for food without a name', () => {
      const newItem = {};
      return chai.request(app)
        .post('/api/food')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then((res) => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
        });
    });


    it('should catch errors and respond properly', () => {
      sandbox.stub(Food.schema.options.toJSON, 'transform').throws('FakeError');

      const newItem = { name: 'newFood' };
      return chai.request(app)
        .post('/api/food')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });

  describe('PUT /api/food/:id', () => {
    it('should update an item', () => {

      const updateItem = { name: 'Updated Name' };
      let data;
      return Food.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app)
            .put(`/api/food/${data.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateItem);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.all.keys(
            'id',
            'name',
            'userId',
            'fruits',
            'vegetables',
            'wholeGrains',
            'leanProteins',
            'nutsAndSeeds',
            'dairy',
            'refinedGrains',
            'fattyProteins',
            'sweets',
            'friedFoods',
            'createdAt',
            'updatedAt'
          );
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(updateItem.name);
          expect(res.body.userId).to.equal(data.userId.toString());
          expect(new Date(res.body.createdAt)).to.eql(data.createdAt);
          expect(new Date(res.body.updatedAt)).to.greaterThan(data.updatedAt);
        });
    });

    it('should catch errors and respond properly', () => {
      sandbox.stub(Food.schema.options.toJSON, 'transform').throws('FakeError');

      const updateItem = { name: 'Updated Name' };
      let data;
      return Food.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app)
            .put(`/api/food/${data.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateItem);
        })
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });
  });

  describe('DELETE /api/food/:id', () => {
    it('should delete an item', () => {
      let data;
      return Food.findOne({ userId: user.id })
        .then(_data => {
          data = _data;
          return chai.request(app)
            .delete(`/api/food/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
          return Food.countDocuments({ _id: data.id });
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });

    it('should catch errors and respond properly', () => {
      sandbox.stub(express.response, 'sendStatus').throws('FakeError');
      return Food.findOne()
        .then(data => {
          return chai.request(app)
            .delete(`/api/food/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
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