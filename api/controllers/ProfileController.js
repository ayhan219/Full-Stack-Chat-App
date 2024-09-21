const express = require('express');
const multer = require('multer');
const User = require('../models/User'); 
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
  });

  const upload = multer({ storage: storage });

  router.post('/upload/:userId', upload.single('profileImage'), async (req, res) => {

    
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Yüklenen resim yolunu kaydetme
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();
  
      res.json({
        message: 'Profile image uploaded successfully',
        profileImage: user.profileImage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;