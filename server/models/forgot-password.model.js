const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  {
    timestamps: true,     // tự động sinh ra trường createAt và updateAt
  }
);

const forgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

module.exports = forgotPassword;