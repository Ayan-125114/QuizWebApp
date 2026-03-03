const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    //Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Prevent Admin Registration
    if (role === "admin") {
      return res.status(403).json({ message: "Cannot register as admin" });
    }

    //Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Set Approval Logic
    let isApproved = true; // default for student

    if (role === "teacher") {
      isApproved = false; // teacher needs admin approval
    }

    //Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      isApproved
    });

    await newUser.save();

    //Response
    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Check if fields are empty
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If teacher and not approved
    if (user.role === "teacher" && !user.isApproved) {
      return res.status(403).json({
        message: "Teacher account not approved by admin yet"
      });
    }

    //Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //Send Response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const approveTeacher = async (req, res) => {
  try {
    const { userId } = req.params;

    //Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Check if role is teacher
    if (user.role !== "teacher") {
      return res.status(400).json({ message: "User is not a teacher" });
    }

    //Approve teacher
    user.isApproved = true;
    await user.save();

    const { password, ...userData } = user._doc;

    res.status(200).json({
      message: "Teacher approved successfully",
      user : userData
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register , login , approveTeacher};