/**
 * @author Tirth Bharatiya (B00955618)
 */
import { Schema, model } from 'mongoose';
import { Discussion } from '../types';

const discussionSchema = new Schema<Discussion>({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], required: true, default: [] },
  timestamp: { type: Date, default: Date.now },
  dislikedBy: { type: [String], default: [] },
  likedBy: { type: [String], default: [] },
  userName: String,
  userImage: String,
  replies: [{ 
    id: { type: String, required: true },
    userId: { type: String, required: true },
    replyText: String,
    timestamp: { type: Date, default: Date.now },
    userName: String,
    userImage: String
  }],
}, { toJSON: { virtuals: true } });

const Discussion = model<Discussion>('Discussion', discussionSchema);

export default Discussion;
