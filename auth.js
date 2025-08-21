import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();

const signAccess = (sub) =>
  jwt.sign({ sub }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TTL || '15m' });

const signRefresh = (sub) =>
  jwt.sign({ sub, typ: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TTL || '30d' });

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, location, role, experience, portfolio, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    firstName, lastName, email: email.toLowerCase(), phone, location, role, experience, portfolio, passwordHash
  });

  // Optional: auto-login after register. Here we return message; frontend can redirect to login.
  res.status(201).json({ message: 'Account created. Please sign in.', userId: user.id });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const access = signAccess(user.id);
  const refresh = signRefresh(user.id);

  // httpOnly refresh cookie
  res.cookie('rt', refresh, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 30
  });

  res.json({
    token: access,
    user: {
      id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
      role: user.role, location: user.location
    }
  });
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.rt;
  if (!token) return res.status(401).json({ message: 'Missing refresh token' });

  try {
    const { sub } = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const access = signAccess(sub);
    res.json({ token: access });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('rt', { httpOnly: true, sameSite: 'lax' });
  res.json({ message: 'Logged out' });
});

export default router;
