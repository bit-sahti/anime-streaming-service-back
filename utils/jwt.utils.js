const jwt = require("jsonwebtoken");

class JwtManager {
  generateToken = id => {
    return jwt.sign(
      { userId: id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION_TIME }
    )
  }

  verifyToken = token => {
      const { userId } = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

      return userId;
  }
}

module.exports = new JwtManager();