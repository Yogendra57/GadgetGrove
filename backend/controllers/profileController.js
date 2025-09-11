const Profile = require('../models/Profile');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const getProfile = async (req, res) => {
    try {
      
        const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.status(200).json({ message: 'Profile fetched successfully!', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const updateProfile = async (req, res) => {
  const { name, bio, location, website } = req.body;

  try {
    // 1. Update Profile
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.bio = bio || profile.bio;
    profile.location = location || profile.location;
    profile.website = website || profile.website;

    // 2. Update images if uploaded
    if (req.files?.profileImage) {
      profile.profileImageUrl = `/uploads/${req.files.profileImage[0].filename}`;
    }
    if (req.files?.coverImage) {
      profile.coverImageUrl = `/uploads/${req.files.coverImage[0].filename}`;
    }

    await profile.save();

    // 3. Update User's name
    if (name) {
      const user = await User.findById(req.user._id);
      user.name = name;
      await user.save();
    }

    res.status(200).json({ 
      message: 'Profile updated successfully!', 
      profile,
      user: await User.findById(req.user._id) // send updated user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports={getProfile,updateProfile};