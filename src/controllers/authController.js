const OtpSession = require('../models/otpModel');
const crypto = require('crypto');
const { z } = require('zod');

// Schema for input validation
const sendOtpSchema = z.object({
  identifier: z.string().min(3, "Email or phone number is required"),
});

const verifyOtpSchema = z.object({
  identifier: z.string().min(3, "Identifier is required"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
});

/**
 * POST /api/auth/send-otp
 * Accepts email or phone, generates a mock OTP, stores it in Mongo.
 */
const sendOtp = async (req, res, next) => {
  try {
    const { identifier } = sendOtpSchema.parse(req.body);

    // Generate a 6-digit mock OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in MongoDB (with TTL of 10 minutes)
    // If it exists, update it to refresh TTL
    await OtpSession.findOneAndUpdate(
      { identifier },
      { otp: mockOtp },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // In a real app, you would send this via Twilio or SendGrid here
    // For this mock assessment, we just return it so we can test.
    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${identifier}`,
      mockOtp: mockOtp // returning it for easy testing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-otp
 * Validates OTP against Mongo, returns session token.
 */
const verifyOtp = async (req, res, next) => {
  try {
    const { identifier, otp } = verifyOtpSchema.parse(req.body);

    const session = await OtpSession.findOne({ identifier, otp });

    if (!session) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // OTP is valid, delete it so it can't be reused
    await OtpSession.deleteOne({ _id: session._id });

    // Generate a secure session token (mocking a JWT with random bytes)
    const sessionToken = crypto.randomBytes(32).toString('hex');

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: sessionToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
};
