const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../Models/UserModels');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        return res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '4d' });
      console.log(user.name)
      return res.status(200).json({
        message: "Login successful",
        token,
        userId: user._id,
        email: user.email,
        name: user.name,
        profilePicture : user.profilePicUri
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Oops Server not working currently..." });
    }
  });
  router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
      if (!email || !newPassword) {
        return res.status(400).json({ success: false, msg: 'Please provide both email and new password.' });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, msg: 'Email not found. Please register or try again.' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ success: true, msg: 'Password updated successfully.' });
    } catch (error) {
      console.error(error.message);
      if (error.name === 'MongoNetworkError') {
        return res.status(503).json({ success: false, msg: 'Network issue. Please try again later.' });
      }
      res.status(500).json({ success: false, msg: 'Internal server error. Please try again later.' });
    }
});

module.exports = router;
