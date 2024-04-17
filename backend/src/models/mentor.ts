import { Schema, model } from "mongoose";
import { Mentor } from "../types";

const mentorSchema = new Schema<Mentor>({
  id: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  imageUrl: { type: String, required: true },
  ratings: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  experience: { type: String, required: true },
  pay: { type: String, required: true },
  expertise: { type: String, required: true },
  resume: { type: String, required: true },
  availability: { type: String, required: true },
  termsAccepted: { type: String, required: true },
});

const MentorModel = model<Mentor>("Mentor", mentorSchema);

export default MentorModel;
