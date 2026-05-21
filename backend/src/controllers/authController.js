import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { store } from '../data/store.js';
import { publicUser } from '../utils/publicUser.js';

const tokenFor = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET || 'dev-secret-change-me', {
    expiresIn: '8h'
  });

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(120),
    phone: z.string().min(8).max(24),
    email: z.string().email(),
    password: z.string().min(8),
    languagePreference: z.enum(['en', 'sw']).default('en')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export async function register(req, res) {
  const input = req.validated.body;
  if (store.findUserByEmail(input.email)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await store.createUser(input);
  return res.status(201).json({ token: tokenFor(user), user: publicUser(user) });
}

export function login(req, res) {
  const { email, password } = req.validated.body;
  const user = store.findUserByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json({ token: tokenFor(user), user: publicUser(user) });
}

export function verify(req, res) {
  return res.json({ user: publicUser(req.user) });
}
