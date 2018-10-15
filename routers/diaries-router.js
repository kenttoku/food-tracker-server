const express = require('express');
const passport = require('passport');

const router = express.Router();

const Diary = require('../models/diary-model');
const { validateId, validateDate } = require('../utils/validate');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  return res.json({ message: 'all items' });
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', (req, res, next) => {
  return res.json({ message: 'one item' });
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', validateDate, (req, res, next) => {
  const userId = req.user.id;
  const { year, month, day } = req.body;
  const date = new Date(year, month, day);

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

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', (req, res, next) => {
  return res.json({ message: 'item updated' });
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  return res.json({ message: 'item deleted' });
});

module.exports = router;