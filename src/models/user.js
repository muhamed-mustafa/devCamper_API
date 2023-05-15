import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { promisify } from 'util';
import {
  EMAIL_REGEX_PATTERN,
  PASSWORD_MIN_LENGTH,
  DEFAULT_USER_ROLE,
  JWT_SECRET,
  JWT_EXPIRATION_TIME,
} from '../constants/constants.js';

const randomBytesAsync = promisify(crypto.randomBytes);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },

    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [EMAIL_REGEX_PATTERN, 'Please add a valid email'],
    },

    role: {
      type: String,
      enum: ['user', 'publisher', 'admin'],
      default: DEFAULT_USER_ROLE,
    },

    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: PASSWORD_MIN_LENGTH,
      select: false,
    },

    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },

    confirmEmailToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id;
      },
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await promisify(bcrypt.genSalt)(+process.env.SALT);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this.id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME,
  });
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  const resetToken = (await randomBytesAsync(20)).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  return resetToken;
};

userSchema.methods.generateEmailConfirmToken = async function () {
  const confirmationToken = (await randomBytesAsync(20)).toString('hex');
  const confirmTokenExtend = (await randomBytesAsync(100)).toString('hex');

  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
  return confirmTokenCombined;
};

export const User = model('User', userSchema);
