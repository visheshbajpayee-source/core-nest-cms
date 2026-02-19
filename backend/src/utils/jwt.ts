import * as jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'change_me_in_production';

export const signToken = (payload: object, expiresIn = '1d'): string =>
  jwt.sign(payload as jwt.JwtPayload | string, SECRET, { expiresIn });

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};
