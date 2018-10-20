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

const validateNewUsermame = function(req, res, next) {
  const { newUsername } = req.body;
  if (!newUsername) {
    const err = new Error('Missing `newUsername` in request body');
    err.status = 400;
    return next(err);
  }
  return next();
};

const validateDate = function(req, res, next) {
  const { yyyymmdd } = req.params;
  if (!yyyymmdd) {
    const err = new Error('Missing `yyyymmdd` in request params');
    err.status = 400;
    return next(err);
  }

  const day = yyyymmdd % 100;
  const month = Math.trunc(yyyymmdd / 100) % 100;

  if (day < 1 || day > 31 || month < 1 || month > 12 || isNaN(yyyymmdd)) {
    const err = new Error('Invalid `yyyymmdd` in request params');
    err.status = 400;
    return next(err);
  }

  return next();
};

const validateUserFields = function(req, res, next) {
  const fields = ['username', 'password'];

  const missingField = fields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const nonStringField = fields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const nonTrimmedField = fields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const minFields = {
    username: 1,
    password: 8
  };

  const tooSmallField = Object.keys(minFields).find(
    field => req.body[field].length < minFields[field]
  );

  const maxFields = { password: 72 };

  const tooLargeField = Object.keys(maxFields).find(
    field => req.body[field].length > maxFields[field]
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${minFields[tooSmallField]} characters long`
        : `Must be at most ${maxFields[tooLargeField]} characters long`,
      location: tooSmallField || tooLargeField
    });
  }
  return next();
};
module.exports = {
  validateId,
  validateName,
  validateDate,
  validateUserFields,
  validateNewUsermame
};