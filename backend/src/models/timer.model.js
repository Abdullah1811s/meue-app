import mongoose from "mongoose";

const SECONDS_IN_60_DAYS = 60 * 60 * 24 * 60; // 60 days in seconds
const SECONDS_IN_30_DAYS = 60 * 60 * 24 * 30; // 30 days in seconds

const TimeSchema = new mongoose.Schema(
  {
    mainWebTime: {
      type: Number,
      default: SECONDS_IN_60_DAYS, // Default to 60 days in seconds
    },
    appTime: {
      type: Number,
      default: SECONDS_IN_30_DAYS, // Default to 30 days in seconds
    },
  },
  { timestamps: true }
);

const TimeModel = mongoose.model("Time", TimeSchema);

export default TimeModel;
