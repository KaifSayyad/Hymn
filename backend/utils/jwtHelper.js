import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: '2h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
