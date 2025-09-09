// models/Profile.js

const mongoose = require('mongoose');
const User=require('./User');
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Links this profile to a specific user in the User collection
    unique: true // Ensures one profile per user
  },

  bio: {
    type: String,
    maxlength: 250,
    default: 'Welcome to my profile!'
  },
  location: {
    type: String,
    trim: true,
  },
  // website: {
  //   type: String,
  //   trim: true,
  // },
  profileImageUrl: {
    type: String,
    default: 'https://via.placeholder.com/150/007bff/FFFFFF?text=User', // Default profile image URL
  },
  coverImageUrl: {
    type: String,
    default: 'https://via.placeholder.com/1000x300/6c757d/FFFFFF?text=Cover+Image', // Default cover image URL
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);