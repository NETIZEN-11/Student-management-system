const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  return token;
};

module.exports = generateToken;
