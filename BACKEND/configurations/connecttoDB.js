// configurations/connecttoDB.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('We are connected to our DATABASE');
  } catch (error) {
    console.error('Sorry we have problems to connect to the DATABASE', error);
    process.exit(1);
  }
};

module.exports = connectDB;