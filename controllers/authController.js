const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, address });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get User Details
exports.getUserDetails = async (req, res) => {
  try {

      const user = await User.findByPk(req.user.id, {
          attributes: { exclude: ["password"] } // Optional: Exclude password field
      });
      // console.log(user.toJSON());

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user });
  } catch (error) {
      res.status(500).json({ message: "Error fetching user details", error });
  }
};
