/**
 * @author Suyash Jhawer B00968936
 */

import { Schema, model } from 'mongoose'
import { UserConnections } from '../types';

// Define the schema for UserConnection
const userConnectionSchema: Schema<UserConnections> = new Schema({
    uid: { type: String, required: true },
    requestSent: { type: [String], default: [] },
    requestReceived: { type: [String], default: [] },
    myConnections: { type: [String], default: [] }
});

// Create and export the UserConnection model
const UserConnectionsModel = model<UserConnections>('UserConnection', userConnectionSchema);
export default UserConnectionsModel