const express = require('express');
const passport = require('passport');

const router = express.Router();

const Food = require('../models/food-model');
const { validateId, validateName } = require('../utils/validate');

router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;
  let filter = { userId };

  return Food.find(filter)
    .sort({ updatedAt: 'desc' })
    .then(results => {
      results ? res.json(results) : next();
    })
    .catch(err => next(err));
});

/* ========== GET/READ A SINGLE ITEM ========== */
router.get('/:id', validateId, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  return Food.findOne({ _id: id, userId })
    .then(result => result ? res.json(result) : next())
    .catch(err => next(err));
});

/* ========== POST/CREATE AN ITEM ========== */
router.post('/', validateName, (req, res, next) => {
  const userId = req.user.id;
  const newFood = { ...req.body, userId };

  return Food.create(newFood)
    .then(result => {
      if (result) {
        res.status(201)
          .location(`${req.originalUrl}/${result.id}`)
          .json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/:id', validateId, validateName, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const newFood = { ...req.body, userId };

  return Food.findOneAndUpdate({ _id: id, userId }, newFood, { new: true })
    .then(result => {
      result ? res.json(result) : next();
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', validateId, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  return Food.findOneAndRemove({ _id: id, userId })
    .then(() => res.sendStatus(204))
    .catch(err => next(err));
});

module.exports = router;