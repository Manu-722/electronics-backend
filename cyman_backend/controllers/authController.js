import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =========================
// REGISTER USER
// =========================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, gender } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine role from ADMIN_EMAILS list
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const role = adminEmails.includes(email) ? "admin" : "user";

    // Create user
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      gender,
      role,
    });

    // Create token
    const token = jwt.sign(
      { userId: newUser._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// =========================
// LOGIN USER
// =========================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Determine role from ADMIN_EMAILS list
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    const role = adminEmails.includes(user.email) ? "admin" : "user";

    // Create token
    const token = jwt.sign(
      { userId: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};