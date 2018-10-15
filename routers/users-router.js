const express = require('express');
const router = express.Router();
const User = require('../models/user-model');

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  const fields = ['username', 'password'];

  const missingField = fields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const nonStringField = fields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const nonTrimmedField = fields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const minFields = {
    username: 1,
    password: 8
  };

  const tooSmallField = Object.keys(minFields).find(
    field => req.body[field].length < minFields[field]
  );

  const maxFields = { password: 72 };

  const tooLargeField = Object.keys(maxFields).find(
    field => req.body[field].length > maxFields[field]
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${minFields[tooSmallField]} characters long`
        : `Must be at most ${maxFields[tooLargeField]} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

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

module.exports = router;