const express = require('express');
const passport = require('passport');

const router = express.Router();

const Diary = require('../models/diary-model');
const { validateId, validateDate } = require('../utils/validate');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  const filter = { userId };
  const { year, month, day } = req.query;
  if (year && month && day) {
    filter.date = new Date(year, month-1, day);
  } else if (year && month) {
    // Add filter to get whole month
  }

  return Diary.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      results ? res.json(results.map(result => result.serialize())) : next();
    })
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', validateDate, (req, res, next) => {
  const userId = req.user.id;
  const { year, month, day } = req.body;
  const date = new Date(year, month-1, day);

  const newDiary = {  ...req.body, userId, date };

  return Diary.create(newDiary)
    .then(result => {
      if (result) {
        res.status(201)
          .location(`${req.originalUrl}/${result.id}`)
          .json(result.serialize());
      } else {
        next();
      }
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('Diary for this date already exists');
        err.status = 400;
      }
      next(err);
    });
});

/* ========== /UPDATE A SINGLE ITEM ========== */
router.patch('/:id', validateId, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { entries = [] } = req.body;

  // TODO: Update diary entries
  return Diary.findOneAndUpdate({ _id: id, userId });
});

module.exports = router;