const express = require('express');
const passport = require('passport');
const createAuthToken = require('../utils/token');

const router = express.Router();
const User = require('../models/user-model');
const { validateNewUsermame, validateUserFields } = require('../utils/validate');

router.post('/', validateUserFields, (req, res, next) => {
  const { username, password } = req.body;

  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        username,
        password: digest
      };
      return User.create(newUser);
    })
    .then(user => {
      return res.status(201)
        .location(`/api/users/${user.id}`)
        .json(user.serialize());
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

router.patch('/', passport.authenticate('local', { session: false, failWithError: true }), validateNewUsermame, (req, res, next) => {
  const { newUsername, goal, email } = req.body;
  const { id } = req.user;
  const newValues = {
    username: newUsername,
    goal,
    email
  };

  return User.findOneAndUpdate({ _id: id },  { $set: newValues }, { new: true })
    .then(result => {
      if (result) {
        const authToken = createAuthToken(result.serialize());
        return res.json(authToken);
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});
module.exports = router;