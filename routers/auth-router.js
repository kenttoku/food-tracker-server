const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const router = express.Router();
const options = { session: false, failWithError: true };
const localAuth = passport.authenticate('local', options);
const jwtAuth = passport.authenticate('jwt', options);

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  return res.json({ authToken });
});

module.exports = router;
