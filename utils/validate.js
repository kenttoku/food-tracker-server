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
  const { year, month, day } = req.body;
  if (!year) {
    const err = new Error('Missing `year` in request body');
    err.status = 400;
    return next(err);
  }

  if (!month) {
    const err = new Error('Missing `year` in request body');
    err.status = 400;
    return next(err);
  }

  if (!day) {
    const err = new Error('Missing `year` in request body');
    err.status = 400;
    return next(err);
  }

  if (!isValidDate(year, month, day)) {
    const err = new Error('Invalid `year/month/day` in request body');
    err.status = 400;
    return next(err);
  }

  return next();
};

function daysInMonth(month, year) {
  // month is 0-indexed
  switch (month-1) {
    case 1 :
      return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
    case 8 : case 3 : case 5 : case 10 :
      return 30;
    default :
      return 31;
  }
}

function isValidDate(year, month, day) {
  return month > 0 && month <= 12 && day > 0 && day <= daysInMonth(month, year);
}

module.exports = {
  validateId,
  validateName,
  validateDate
};