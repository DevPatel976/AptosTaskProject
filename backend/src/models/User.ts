import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  aptosAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  aptosAddress: {
    type: String,
    required: true,
    unique: true,
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', UserSchema);
