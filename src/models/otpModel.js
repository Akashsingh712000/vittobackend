const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 600 seconds = 10 minutes (TTL Index)
  },
});

module.exports = mongoose.model('OtpSession', otpSchema);
