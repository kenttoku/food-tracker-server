const express = require('express');
const passport = require('passport');

const router = express.Router();
const User = require('../models/user-model');
const { validateId, validateUserFields } = require('../utils/validate');

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

router.put('/', passport.authenticate('jwt', { session: false, failWithError: true }), validateUserFields, (req, res, next) => {
  console.log('running');
  const { password } = req.body;
  const { id } = req.user;

  return User.hashPassword(password)
    .then(digest => {
      const updatedUser = {
        ...req.body,
        password: digest
      };
      return User.findOneAndUpdate({ _id: id }, updatedUser, { new: true });
    })
    .then(result => {
      result ? res.json(result.serialize()) : next();
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