const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next){
  const token = req.header('x-jwt-token');
  if (!token) return res.status(401).send('Access Denied. No token provided');

  try {
    const decoded = jwt.verify(token, config.get('jwt_private_key'));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
}

module.exports = auth;