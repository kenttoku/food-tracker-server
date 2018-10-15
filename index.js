/* eslint-disable no-console */
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN, MONGODB_URI } = require('./config');
const usersRouter = require('./routers/users-router');

const app = express();

// Middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

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
