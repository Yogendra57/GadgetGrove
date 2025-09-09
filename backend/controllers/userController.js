const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwt");
const sendEmail = require("../utils/sendEmail"); // make sure you have this util
const Profile = require("../models/Profile");
// Register

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password" });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect username or password" });
    }

    const token = generateToken(foundUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      account: {
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error while login, try again!" });
  }
};

// Logout
const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout successful" });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Please provide an email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // return generic message to prevent email enumeration
      return res
        .status(200)
        .json({
          message:
            "If a matching account was found, a password reset OTP has been sent to your email.",
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpires = Date.now() + 600000; // 10 min
    await user.save();

    const emailSubject = "Password Reset OTP";
    const emailText = `Your password reset OTP is: ${otp}. This code is valid for 10 minutes.`;

    await sendEmail({
      email: user.email,
      subject: emailSubject,
      message: emailText,
    });

    res
      .status(200)
      .json({
        message:
          "If a matching account was found, a password reset OTP has been sent to your email.",
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to reset password, please try again" });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, otp, newpassword } = req.body;
  if (!email || !otp || !newpassword) {
    return res
      .status(400)
      .json({ message: "Please provide email, otp, and new password" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.otp || "");
    const isOtpExpired = user.otpExpires < Date.now();

    if (!isOtpValid || isOtpExpired) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpires"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User details fetched successfully", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to fetch user details try again!" });
  }
};

// For generating OTP
// const sendEmail = require('../utils/sendEmail'); // Assumed email utility

// --- 1. Register User and Send OTP ---
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    if (existingUser) {
      // Update existing unverified user with new data and OTP
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Create new user entry
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires,
      });
      await Profile.create({
        user: newUser._id,
        // Add any default values here if needed, e.g., location: ""
      });
    }

    // Send OTP email (implement sendEmail utility separately)
    // await sendEmail({
    //   to: email,
    //   subject: 'Verify Your Account - MyStore',
    //   text: `Your OTP for account verification is: ${otp}. It will expire in 10 minutes.`
    // });
    const emailSubject = "Verify Your Account - MyStore";
    const emailText = `Your OTP for account verification is: ${otp}. It will expire in 10 minutes.`;

    await sendEmail({
      email: email,
      subject: emailSubject,
      message: emailText,
    });

    res
      .status(201)
      .json({
        message: "OTP sent to email. Please verify to complete registration.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// --- 2. Verify OTP and Activate Account ---
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified." });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Verification successful
    user.isVerified = true;
    user.otp = undefined; // Clear OTP fields
    user.otpExpires = undefined;
    await user.save();

    // Send Welcome Email (implement sendEmail utility separately)
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Welcome to MyStore!',
    //   text: `Hi ${user.name}, welcome to MyStore! Your account is now active.`
    // });

    const emailSubject = "Welcome to MyStore!";
    const emailText = `Hi ${user.name}, welcome to MyStore! Your account is now active.`;

    await sendEmail({
      email: user.email,
      subject: emailSubject,
      message: emailText,
    });
    res
      .status(200)
      .json({ message: "Account verified successfully. Please login." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};
module.exports = {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
};
