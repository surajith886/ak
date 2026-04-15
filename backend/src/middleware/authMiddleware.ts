import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'customer';
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      const user = await User.findByPk(decoded.id);
      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }
      
      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
