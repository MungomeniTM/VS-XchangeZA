import mongoose from 'mongoose';

const CollabSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // who created the intent
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // optional: who they want to collaborate with
  message: { type: String, default: '' },
  status: { type: String, enum: ['open','accepted','declined'], default: 'open' }
}, { timestamps: true });

export default mongoose.model('Collaboration', CollabSchema);
