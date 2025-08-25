// controllers/authController.js
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      location,
      role,
      experience,
      portfolio,
      password,
    } = req.body;

    // ✅ Validate
    if (!firstName || !lastName || !email || !location || !role || !experience || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // ✅ Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      location,
      role,
      experience,
      portfolio,
      password,
    });

    res.status(201).json({
      message: "User registered successfully.",
      userId: user._id,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
};
