import mongoose from 'mongoose';

const RaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    vendorId: {
      type: String,

    },
    prizes: {
      type: [
        {
          name: { type: String, required: true },
          id: { type: String },
          quantity: { type: String },
          endDate: { type: Date },
        },
      ],
      required: [true, 'prizes is required'],
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',

        },
        entries: {
          type: Number,
          enum: [10, 1],

        },
      },
    ],
    winner: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        prize: {
          type: String,
          default: null,
        },
        isEmailSent: {
          type: Boolean,
          default: false, // Default to false, indicating email has not been sent
        },
      },
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
      default: false,
    },
    banner: {
      type: String
    },
    termsAndConditions:{
      type:String,
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

