const express = require('express');
const passport = require('passport');
const createAuthToken = require('../utils/token');
const User = require('../models/user-model');

const router = express.Router();
const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);
const jwtAuth = passport.authenticate('jwt', options);

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/demo', (req, res) => {
  User.findOne({ username: 'demouser' })
    .then((user) => {
      const authToken = createAuthToken(user.serialize());
      return res.json({ authToken });
    });
});

module.exports = router;
