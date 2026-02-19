import { Router } from 'express';
import User from '../models/User';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already in use' });
    const hashed = await hashPassword(password);
    const user = await User.create({ name, email, password: hashed, role });
    const token = signToken({ id: user._id, role: user.role });
    res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }, message: 'User created' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).json({ success: false, message: 'Invalid credentials' });
    const token = signToken({ id: user._id, role: user.role });
    res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token }, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/me', protect, async (req: any, res) => {
  res.json({ success: true, data: req.user });
});

export default router;
