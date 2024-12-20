const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

// user registration route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // check for duplicate emails
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'email already in use' });
    }

    // hashing password to be stored in DB
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    // JWT token creation
    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// user login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'email not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'invalid email/password combination' });
    }

    const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// get user account details
router.get('/account', auth, async (req, res) => {

  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ msg: 'user not found' });
    }
    res.json({
      highScore: user.highScore,
      lifetimeCorrect: user.lifetimeCorrectAnswers,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// update user high score and lifetime correct answers
router.post('/update-score', auth, async (req, res) => {
  const { score } = req.body;

  try {
    const user = req.user;
    
    if (score > user.highScore) {
      user.highScore = score;
    }
    
    user.lifetimeCorrectAnswers += score; 
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});



module.exports = router;
