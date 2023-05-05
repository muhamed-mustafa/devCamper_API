import { ErrorResponse } from '../utils/errorResponse.js';

const HTTP_STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGE = {
  DUPLICATE_FIELD: 'Duplicate field value entered',
  RESOURCE_NOT_FOUND: (value) => `Resource not found with this ID of ${value}`,
};

const handleCaseError = (err) => {
  const message = ERROR_MESSAGE.RESOURCE_NOT_FOUND(err.value);
  return new ErrorResponse(message, HTTP_STATUS_CODE.NOT_FOUND);
};

const handleDuplicateKeyError = () => {
  const message = ERROR_MESSAGE.DUPLICATE_FIELD;
  return new ErrorResponse(message, HTTP_STATUS_CODE.BAD_REQUEST);
};

const handleValidationError = (err) => {
  const message = Object.values(err.errors).map((val) => val.message);
  return new ErrorResponse(message, HTTP_STATUS_CODE.BAD_REQUEST);
};

const handleError = (err) => {
  const message = err.message || 'Server error';
  const statusCode = err.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
  return new ErrorResponse(message, statusCode);
};

export const errorHandler = (err, _req, res, _next) => {
  let error;

  switch (true) {
    case err.name === 'CaseError':
      error = handleCaseError(err);
      break;
    case err.code === 11000:
      error = handleDuplicateKeyError();
      break;
    case err.name === 'ValidationError':
      error = handleValidationError(err);
      break;
    default:
      error = handleError(err);
      break;
  }

  res.status(error.statusCode).json({ success: false, message: error.message });
};
