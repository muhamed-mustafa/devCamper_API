import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/errorResponse.js';
import { User } from '../models/user.js';

const protect = asyncHandler(async (req, _res, next) => {
  let token,
    { authorization } = req.headers;

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token)
    return next(new ErrorResponse('Not authorize to access this route', 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorize to access this route', 401));
  }
});

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

export { protect, authorize };
