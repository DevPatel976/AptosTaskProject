import mongoose, { Schema, Document } from 'mongoose';

export type TaskStatus = 'pending' | 'planning' | 'executing' | 'completed' | 'failed';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type StepStatus = 'pending' | 'completed' | 'failed';

export interface ITaskStep {
  description: string;
  status: StepStatus;
  result?: string;
}

export interface ITask extends Document {
  description: string;
  cost: number;
  status: TaskStatus;
  paymentStatus: PaymentStatus;
  steps: ITaskStep[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'planning', 'executing', 'completed', 'failed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  steps: [{
    description: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    result: String
  }],
  userId: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export const Task = mongoose.model<ITask>('Task', taskSchema);
