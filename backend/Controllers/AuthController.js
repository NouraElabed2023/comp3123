const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const UserModel = require("../Models/User");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed: email or password is wrong";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params; // Get userId and token from URL params

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is invalid or expired, return an error
    if (!decodedToken) {
      return res.status(401).send({ message: "Invalid token" });
    }

    // Find the user with the id from the token
    const user = await UserModel.findOne({ _id: decodedToken._id });
    if (!user) {
      return res.status(401).send({ message: "No user found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword, salt);

    // Update user's password
    user.password = newPassword;
    await user.save();

    // Send success response
    res.status(200).send({ message: "Password updated successfully" });
  } catch (err) {
    // Send error response if any error occurs
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
  resetPassword,
};
