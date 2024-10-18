const express = require('express');
const router = express.Router();
const User = require("../Models/UserModels");
const auth = require('../Middleware/authmidlleware');

router.get('/get-profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');  
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
router.post('/get-other-profile', async (req, res) => {
    try {
        const { userId } = req.body; 
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.put('/setup-profile/:id', async (req, res) => {
    const { id } = req.params; 
    const {profilePicUri, userBio, dateOfBirth, gender, location } = req.body;
    try {
        const user = await User.findById(id); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (profilePicUri) user.profilePicUri = profilePicUri;
        if (userBio) user.userBio = userBio;
        if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
        if (gender) user.gender = gender;
        if (location) user.location = location;
        await user.save();
        const updatedUser = await User.findById(id).select('-password');
        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/edit-profile', auth, async (req, res) => {
    const {profilePicUri, name, location } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (profilePicUri) user.profilePicUri = profilePicUri;
        if (name) user.name = name;
        if (location) user.location = location;
        await user.save();
        const updatedUser = await User.findById(req.user.userId).select('-password');
        res.status(200).json({ message: "Profile edited successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
