const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Access denied' });
  
    const token = authHeader.split(' ')[1]; // Extract the token part after 'Bearer'
    if (!token) return res.status(401).json({ error: 'Access denied' });
  
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid token' });
    }
  };
  

module.exports = auth;
