// userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {type: String, require: true},
  email: {type: String, require: true, unique: true},
  password: {type: String, require: true},
  actSummary: {type: String}
}, {timestamps: true});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
