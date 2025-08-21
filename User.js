import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, index: true, required: true },
  phone: String,
  location: String,
  role: String,
  experience: String,
  portfolio: String,
  passwordHash: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
