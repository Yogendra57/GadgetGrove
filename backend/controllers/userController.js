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
    let emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <style>
              body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
              .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
              .header { background-color: #007bff; color: #ffffff; padding: 40px; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { padding: 40px 30px; color: #333333; line-height: 1.6; text-align: center; }
              .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; padding: 15px; background-color: #f0f0f0; border-radius: 5px; display: inline-block; }
              .security-note { font-size: 12px; color: #888888; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px; }
              .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header"><h1>Password Reset Code</h1></div>
              <div class="content">
                  <p>Hi [User Name],</p>
                  <p>We received a request to reset your password. Please enter the One-Time Password (OTP) below on the reset page to continue. This code is valid for 10 minutes.</p>
                  <div class="otp-code">[OTP Code]</div>
                  <div class="security-note"><p>If you did not request a password reset, please ignore this email. For your security, never share this code with anyone.</p></div>
              </div>
              <div class="footer"><p>&copy; [Year] [Company Name]. All rights reserved.</p></div>
          </div>
      </body>
      </html>
    `;

    // Replace placeholders with actual data
    emailHtml = emailHtml.replace('[User Name]', user.name);
    emailHtml = emailHtml.replace('[OTP Code]', otp);
    emailHtml = emailHtml.replace('[Year]', new Date().getFullYear());
    emailHtml = emailHtml.replace('[Company Name]', 'GadgetGrove');

    await sendEmail({
      email: user.email,
      subject: emailSubject,
      message: emailHtml,
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
    const emailSubject = "Verify Your Account - GadgetGrove";
    let emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background-color: #28a745; color: #ffffff; padding: 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; text-align: center; }
        .otp-code { font-size: 36px; font-weight: bold; color: #333333; letter-spacing: 5px; margin: 20px 0; padding: 15px; background-color: #f0f0f0; border-radius: 5px; display: inline-block; }
        .security-note { font-size: 12px; color: #888888; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 20px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888888; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to [Company Name]!</h1>
        </div>
        <div class="content">
            <p>Hi [User Name],</p>
            <p>Thank you for signing up. Please use the One-Time Password (OTP) below to verify your email address and complete your registration. This code is valid for 10 minutes.</p>
            
            <div class="otp-code">[OTP Code]</div>
            
            <div class="security-note">
                <p>If you did not create an account, no further action is required. For your security, please do not share this code with anyone.</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; [Year] [Company Name]. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
emailHtml = emailHtml.replace(/\[User Name\]/g, name);
    emailHtml = emailHtml.replace(/\[OTP Code\]/g, otp);
    emailHtml = emailHtml.replace(/\[Year\]/g, new Date().getFullYear());
    emailHtml = emailHtml.replace(/\[Company Name\]/g, 'GadgetGrove');

    await sendEmail({
      email: email,
      subject: emailSubject,
      message: emailHtml,
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

    const emailSubject = "Welcome to GadgetGrove!";
    let emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            background-color: #f4f7f6;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #007bff;
            padding: 40px;
            text-align: center;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
            text-align: center;
        }
        .content h1 {
            color: #333333;
            font-size: 28px;
            margin-top: 0;
        }
        .content p {
            font-size: 16px;
            color: #555555;
        }
        .cta-button {
            display: inline-block;
            padding: 14px 30px;
            margin: 30px 0;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
        }
        .features {
            margin-top: 30px;
            text-align: left;
            border-top: 1px solid #eeeeee;
            padding-top: 20px;
        }
        .features h3 {
            text-align: center;
            color: #333333;
            margin-bottom: 20px;
        }
        .features ul {
            list-style: none;
            padding: 0;
        }
        .features li {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .features li span {
            font-size: 20px;
            color: #28a745;
            margin-right: 15px;
        }
        .footer {
            background-color: #f4f7f6;
            padding: 30px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
        .social-links a {
            margin: 0 10px;
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="content">
            <h1>Welcome Aboard, [User Name]!</h1>
            <p>We're thrilled to have you join the [Company Name] family. Your account is now active and you're all set to explore a world of amazing products.</p>
            
            <a href="[Shop Link]" class="cta-button">Start Shopping Now</a>
            
            <div class="features">
                <h3>Here's what you can look forward to:</h3>
                <ul>
                    <li><span>✔</span> Exclusive deals and member-only offers.</li>
                    <li><span>✔</span> A faster, seamless checkout experience.</li>
                    <li><span>✔</span> Easy order tracking and history.</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>Follow us on social media!</p>
            <div class="social-links">
                <a href="[Instagram Link]"><img src="https://i.pinimg.com/736x/12/d7/52/12d752c2919daaf807d8b71f3dbed1a0.jpg" alt="Facebook" width="24"></a>
                <a href="[Linkedin Link]"><img src="https://thumbs.dreamstime.com/b/linkedin-vector-circular-blue-icon-linkedin-vector-circular-blue-icon-social-media-icon-website-mobile-apps-183034665.jpg" alt="Twitter" width="24"></a>
                <a href="[Email Link]"><img src="https://png.pngtree.com/template/20190725/ourmid/pngtree-gmail-logo-png-image_282635.jpg" alt="Instagram" width="24"></a>
            </div>
            <p class="mt-3">[Company Name] | [Company Address]</p>
        </div>
    </div>
</body>
</html>`;
emailHtml = emailHtml.replace(/\[User Name\]/g, user.name);
    emailHtml = emailHtml.replace(/\[Shop Link\]/g, process.env.FRONTEND_URL);
    emailHtml=emailHtml.replace(/\[Company Name\]/g,'GadgetGrove');
    emailHtml=emailHtml.replace(/\[Company Address\]/g,'15, Fatiyabad, Alwar, Rajasthan, India - 301712');
    emailHtml=emailHtml.replace(/\[Instagram Link\]/g,'https://www.instagram.com/yugydv__/#');
    emailHtml=emailHtml.replace(/\[Linkedin Link\]/g,'https://www.linkedin.com/in/yogendra57/');
    emailHtml=emailHtml.replace(/\[Email Link\]/g,'mailto:yogendrayadavv57@gmail.com');
    await sendEmail({
      email: user.email,
      subject: emailSubject,
      message: emailHtml,
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
