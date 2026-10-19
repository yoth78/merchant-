import jwt from 'jsonwebtoken';
import { AuthUserPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-token-key-32-chars-minimum-prod';

export function signToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthUserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUserPayload;
  } catch (err) {
    return null;
  }
}
