const express = require('express');
const passport = require('passport');

const router = express.Router();

const Diary = require('../models/diary-model');
const { validateId, validateDate } = require('../utils/validate');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

router.post('/', validateDate, (req, res, next) => {
  const userId = req.user.id;
  const { yyyymmdd } = req.body;
  const filter = { userId, yyyymmdd };
  const newDiary = { ...req.body, userId };

  return Diary.findOne(filter)
    .then(result => {
      console.log(result);
      if (result) {
        return res.json(result.serialize());
      } else {
        return Diary.create(newDiary)
          .then(result => {
            if (result) {
              res.status(201)
                .location(`${req.originalUrl}/${result.yyyymmdd}`)
                .json(result.serialize());
            } else {
              next();
            }
          });
      }
    })
    .catch(err => next(err));
});

/* ========== /UPDATE A SINGLE ITEM ========== */
router.patch('/:yyyymmdd', (req, res, next) => {
  const { yyyymmdd } = req.params;
  const userId = req.user.id;
  let { entries = [] } = req.body;

  console.log('==================================');
  console.log(entries);
  return Diary.findOneAndUpdate(
    { yyyymmdd, userId },
    { $set: { entries } },
    { new:true }
  ).then(result => res.json(result.populate().serialize()));
});

module.exports = router;