import mongoose from 'mongoose';

const RaffSchema = new mongoose.Schema(
  {
    prizes: {
      type: [String],
      required: [true, 'List of prizes is required'],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed'], 
      default: 'scheduled', 
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

RaffSchema.pre('save', function (next) {
  if (!this.scheduledAt) {
    this.scheduledAt = new Date();
  }
  next();
});

export default mongoose.model('RaffModel', RaffSchema);
