const mongoose = require('mongoose');

const validateId = function(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }
  return next();
};

const validateName = function(req, res, next) {
  const { name } = req.body;
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  return next();
};

const validateDate = function(req, res, next) {
  const { yyyymmdd } = req.body;
  if (!yyyymmdd) {
    const err = new Error('Missing `yyyymmdd` in request body');
    err.status = 400;
    return next(err);
  }

  const day = yyyymmdd % 100;
  const month = Math.trunc(yyyymmdd / 100) % 100;

  if (day < 1 || day > 31 || month < 1 || month > 12 || isNaN(yyyymmdd)) {
    const err = new Error('Invalid `yyyymmdd` in request body');
    err.status = 400;
    return next(err);
  }

  return next();
};

module.exports = {
  validateId,
  validateName,
  validateDate
};