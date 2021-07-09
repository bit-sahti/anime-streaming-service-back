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
      return jwt.verify(token, process.env.JWT_SECRET)
  }
}

module.exports = new JwtManager();