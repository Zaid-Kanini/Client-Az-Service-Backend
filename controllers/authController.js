const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        email: email.trim().toLowerCase(),
        otp,
        otpExpiry,
      });
    }

    // Send OTP via email
    try {
      await transporter.sendMail({
        from: `"AZ Cake Service" <${process.env.EMAIL_USER}>`,
        to: email.trim(),
        subject: 'Your OTP Code - AZ Cake Service',
        html: `<div style="font-family:Arial,sans-serif;text-align:center;padding:20px;">
          <h2 style="color:#0D1B4C;">AZ Cake Service</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#F5941E;letter-spacing:8px;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>`,
      });
    } catch (emailErr) {
      console.log('Email send failed, OTP logged to console:', otp);
    }

    // Also log to console for development
    console.log(`OTP for ${email}: ${otp}`);

    res.json({
      message: 'OTP sent to your email',
      // Remove this in production — only for development/testing
      otp_dev: otp,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/verify-otp
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found. Please request OTP first.' });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP requested. Please request a new OTP.' });
    }

    if (new Date() > user.otpExpiry) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified — clear it
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name.trim();
    await user.save();

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-otp -otpExpiry');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, updateProfile, getMe };
