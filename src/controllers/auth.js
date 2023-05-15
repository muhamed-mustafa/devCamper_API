import asyncHandler from 'express-async-handler';
import { ErrorResponse } from '../utils/errorResponse.js';
import { User } from '../models/user.js';
import crypto from 'crypto';
import EmailService from '../utils/emailService.js';

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  await EmailService.sendConfirmationEmail(user, req);
  await user.save({ validateBeforeSave: false });
  sendTokenResponse({ user, statusCode: 201, res });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorResponse('Please provide an email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password)))
    return next(new ErrorResponse('Invalid credentials', 401));

  sendTokenResponse({ user, statusCode: 200, res });
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', '', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotPassword
// @access    Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  let { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return next(new ErrorResponse('There is no user with that email', 404));

  try {
    await EmailService.sendPasswordResetEmail(user, req);
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resetToken
// @access    Public
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse({ user, statusCode: 200, res });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updateDetails
// @access    Private
const updateDetails = asyncHandler(async (req, res) => {
  let { email, name } = req.body;

  const fieldsToUpdate = { name, email };

  const user = await User.findOneAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatePassword
// @access    Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse({ user, statusCode: 200, res });
});

/**
 * @desc    Confirm Email
 * @route   GET /api/v1/auth/confirmEmail
 * @access  Public
 */
const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;

  if (!token) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  const splitToken = token.split('.')[0];
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(splitToken)
    .digest('hex');

  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400));
  }

  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse({ user, statusCode: 200, res });
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
    secure: process.env.NODE_ENV === 'production',
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

export {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  confirmEmail,
};
