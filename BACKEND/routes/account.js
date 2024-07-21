const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/api/v1/accounts', async (req, res) => {
  try {
    const account = new mongoose.model('ACCOUNT', {
      name: req.body.name,
      email: req.body.email,
      dateOfBirth: req.body.date,
      gender: req.body.gender,
      password: req.body.password,
      profilePhoto: req.body.profilePhoto
    });
    await account.save();
    res.status(201).json({ success: true, message: 'The account is created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating an account' });
  }
});

module.exports = router;