import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

export default async function authMiddleware(req, res, next) {
  // GRAB THE BEARER TOKEN FROM AUTHORIZATION HEADER 
  const authHeader = req.headers.authorization; // fixed typo here
  if (!authHeader || !authHeader.startsWith('Bearer ')) { // fixed typo here
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, token is missing" });
  }
  const token = authHeader.split(' ')[1];

  // VERIFY & ATTACH USER OBJECT
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: "User not Found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT verification failed", err);
    return res.status(401).json({ success: false, message: "Token invalid" });
  }
}
