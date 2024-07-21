
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    profilePhoto: { type: String, required: true }
  });

  const account = mongoose.model('ACCOUNT', accountSchema);



  module.exports = account;