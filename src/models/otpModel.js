const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String, // can be phone or email
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt automatically
  }
);

// TTL Index (10 minutes)
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('OtpSession', otpSchema);