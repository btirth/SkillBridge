import { Schema, model } from "mongoose";
import { Message } from "../types";

const messageSchema: Schema<Message> = new Schema({
    senderId: { type: String, required: true, },
    receiverId: { type: String, required: true, },
    message: { type: String, required: true, },
    // createdAt, updatedAt
}, { timestamps: true })

const MessageModel = model<Message>(
    "Message",
    messageSchema
)

export default MessageModel
