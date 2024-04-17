/**
 * @author Suyash Jhawer B00968936
 */

import { Schema, model } from 'mongoose'
import { ContentFeed } from '../types'

// Define contentFeedSchema
const contentFeedSchema: Schema<ContentFeed> = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    feed: { type: String, required: true },
    likes: {
        userIds: { type: [{ type: String }], default: [] }, // Array of user IDs who liked the content
        count: { type: Number, default: 0 }, // Count of likes with default value
    },
    comments: [
      {
        id: { type: String, required: true },
        userId : { type: String, required: true } , 
        name: { type: String, required: true },
        image: { type: String },
        comment: { type: String, required: true },
      },
    ],
    datePublish: { type: Date, required: true },
    image: { type: String},
  });
const ContentFeedModel = model<ContentFeed>('ContentFeed', contentFeedSchema);

export default ContentFeedModel;