/* eslint-disable no-console */
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const { PORT, CLIENT_ORIGIN, MONGODB_URI } = require('./config');

const authRouter = require('./routers/auth-router');
const foodRouter = require('./routers/food-router');
const usersRouter = require('./routers/users-router');

const localStrategy = require('./passport/local-strategy');
const jwtStrategy = require('./passport/jwt-strategy');

const app = express();

// Passport Related
passport.use(localStrategy);
passport.use(jwtStrategy);

// Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/food', foodRouter);
app.use('/api/users', usersRouter);

if (require.main === module) {
  mongoose.connect(MONGODB_URI, { useNewUrlParser:true })
    .then(() => console.log('Database Connected'))
    .catch(err => console.error(err));

  app.listen(PORT, function() {
    console.info(`Server listening on ${this.address().port}`);
  }).on('error', err => console.error(err));
}

module.exports = { app };
