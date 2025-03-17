import mongoose from 'mongoose';

const RaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    vendorId: {
      type: String,
      required: true,
    },
    prizes: {
      type: [
        {
          name: { type: String, required: true },
          id: { type: String, required: true },
          quantity: { type: Number },
          endDate: { type: Date }
        }
      ],
      required: [true, 'List of prizes is required'],
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

    winner: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
        prize: {
          type: String,
          default: null,
        },
      }
    ],    
    scheduledAt: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed'],
      default: 'scheduled',
    },
    isVisible: {
      type: Boolean,
      default: false
    }

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
