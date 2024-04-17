import { Schema, model } from "mongoose";
import { MentorshipBooking } from "../types";

const mentorshipBookingsSchema: Schema<MentorshipBooking> = new Schema({
  id: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  mentorId: { type: String, required: true },
  userId: { type: String, required: true },
  transactionId: { type: String },
});

const MentorshipBookingsModel = model<MentorshipBooking>(
  "MentorshipBookings",
  mentorshipBookingsSchema
);

export default MentorshipBookingsModel;
