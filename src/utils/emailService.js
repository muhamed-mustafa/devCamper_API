import { sendEmail } from '../utils/sendEmail.js';

class EmailService {
  async sendConfirmationEmail(user, req) {
    const confirmEmailToken = await user.generateEmailConfirmToken();
    const confirmEmailURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/confirmEmail?token=${confirmEmailToken}`;
    const message = `You are receiving this email because you need to confirm your email address. Please click on the following link to confirm your email: \n\n ${confirmEmailURL}`;

    return sendEmail({
      email: user.email,
      subject: 'Email confirmation',
      message,
    });
  }

  async sendPasswordResetEmail(user, req) {
    const resetToken = await user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link to reset your password: \n\n ${resetUrl}`;

    return sendEmail({
      email: user.email,
      subject: 'Password reset',
      message,
    });
  }
}

export default new EmailService();
