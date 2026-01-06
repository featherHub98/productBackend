const jwt = require('jsonwebtoken')

interface CustomJwtPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  sub?: string;
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

    const decoded = jwt.decode(token, { complete: true });
    
    if (!decoded || !decoded.payload) {
      res.status(401).json({ message: 'Invalid token structure' });
      return;
    }

    const payload = decoded.payload as CustomJwtPayload;
 
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    
    req.user = payload;
    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Invalid token format' });
  }
};
module.exports = {verifyToken}