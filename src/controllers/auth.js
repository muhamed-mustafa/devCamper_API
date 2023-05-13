import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/errorResponse.js';
import { User } from '../models/user.js';

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public

const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  sendTokenResponse({ user, statusCode: 201, res });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || (await user.matchPassword(password)))
    return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse({ user, statusCode: 200, res });
});
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private

const sendTokenResponse = async ({ user, statusCode, res }) => {
  const token = await user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

export { register, login, getMe };
