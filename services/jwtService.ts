const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

interface JwtPayload {
  userId: number;
  username: string;
  email?: string;
  role?: string;
}

const verifyToken = (req: any, res: any, next: any): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  
  const token = authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Malformed token' });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
    } else {
      res.status(500).json({ message: 'Token verification failed' });
    }
  }
};

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

const generateTokenForUser = (userId: number, username: string, email?: string, role?: string): string => {
  const payload: JwtPayload = {
    userId,
    username,
    ...(email && { email }),
    ...(role && { role })
  };
  
  return generateToken(payload);
};

const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};

module.exports = {
  verifyToken,
  generateToken,
  generateTokenForUser,
  decodeToken
};