import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput } from '../validators/auth.schema.js';

// MOCK DB for demonstration, replace with Prisma client
const usersDb: any[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'super_secret_refresh_key';

export class AuthService {
  async login(payload: LoginInput) {
    const user = usersDb.find(u => u.email === payload.email);
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) throw new Error('Invalid credentials');

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id }, 
      REFRESH_SECRET, 
      { expiresIn: '7d' }
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    };
  }

  async register(payload: RegisterInput) {
    const existing = usersDb.find(u => u.email === payload.email);
    if (existing) throw new Error('User already exists');

    const passwordHash = await bcrypt.hash(payload.password, 12);
    
    const newUser = {
      id: String(Date.now()),
      email: payload.email,
      passwordHash,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role
    };

    usersDb.push(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded: any = jwt.verify(refreshToken, REFRESH_SECRET);
      
      const user = usersDb.find(u => u.id === decoded.id);
      if (!user) throw new Error('User not found');

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '15m' }
      );

      return { accessToken };
    } catch (e) {
      throw new Error('Invalid refresh token');
    }
  }
}
