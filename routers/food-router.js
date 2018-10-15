const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const router = express.Router();

const Food = require('../models/food-model');

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
router.post('/', (req, res, next) => {
  const {
    name,
    fruits,
    vegetables,
    wholeGrains,
    leanProteins,
    nutsAndSeeds,
    dairy,
    refinedGrains,
    fattyProteins,
    sweets,
    friedFoods
  } = req.body;
  const userId = req.user.id;

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  return res.json({ message: 'item created' });
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