const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

const Food = require('../models/food-model');
const { validateId, validateName } = require('../utils/validate');

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
router.post('/', validateName, (req, res, next) => {
  const userId = req.user.id;
  const newFood ={ userId, ...req.body };

  return Food.create(newFood)
    .then(result => {
      if (result) {
        res.status(201)
          .location(`${req.originalUrl}/${result.id}`)
          .json(result.serialize());
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
  const newFood = { userId, ...req.body };

  return Food.findOneAndUpdate({ _id: id }, newFood, { new: true })
    .then(result => {
      result ? res.json(result.serialize()) : next();
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/:id', (req, res, next) => {
  return res.json({ message: 'item deleted' });
});

module.exports = router;