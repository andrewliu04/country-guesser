const mongoose = require('mongoose');

// schema for user collection
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  lifetimeCorrectAnswers: { type: Number, default: 0 },
  highScore: { type: Number, default: 0 },
}); 

module.exports = mongoose.model('User', UserSchema);
