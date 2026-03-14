const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { Resend } = require('resend');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// POST /api/auth/send-otp
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    console.log("Generating OTP for:", normalizedEmail);

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        email: normalizedEmail,
        otp,
        otpExpiry,
      });
    }

    console.log(`OTP for ${normalizedEmail}: ${otp}`);

    // respond immediately
    res.json({
      message: 'OTP sent to your email',
      otp_dev: otp, // remove in production
    });

    // send email asynchronously
    resend.emails.send({
      from: 'AZ Cake Service <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Your OTP Code - AZ Cake Service',
      html: `
      <div style="font-family:Arial,sans-serif;text-align:center;padding:20px;">
        <h2 style="color:#0D1B4C;">AZ Cake Service</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#F5941E;letter-spacing:8px;">${otp}</h1>
        <p>This code expires in 5 minutes.</p>
      </div>
      `
    })
    .then(() => {
      console.log("OTP email sent successfully");
    })
    .catch((err) => {
      console.error("Email sending failed:", err.message);
    });

  } catch (error) {
    console.error("Send OTP error:", error);
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

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

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

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

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
    console.error("Verify OTP error:", error);
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
    console.error("Update profile error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-otp -otpExpiry');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });

  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  sendOtp,
  verifyOtp,
  updateProfile,
  getMe
};
