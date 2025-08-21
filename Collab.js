import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Collaboration from '../models/Collaboration.js';

const router = Router();

// Create a collaboration intent (no target or with targetUser)
router.post('/collab/intent', requireAuth, async (req, res) => {
  const { message = '', targetUser = null } = req.body || {};
  const doc = await Collaboration.create({ owner: req.userId, targetUser, message });
  res.status(201).json({ ok: true, id: doc.id });
});

// List my collaboration items
router.get('/collab/mine', requireAuth, async (req, res) => {
  const items = await Collaboration.find({ owner: req.userId }).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

export default router;
