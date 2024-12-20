const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // extract token from auth header
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // exclude password from object
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'failed, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'token failed' });
    }
  } else {
    return res.status(401).json({ message: 'no token provided' });
  }
};
