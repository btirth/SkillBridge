import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Conversation } from "../types";

const conversationSchema: Schema<Conversation> = new Schema({
    participants: [{ type: String, },],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
            default: [],
        },
    ],
}, { timestamps: true }
)

const ConversationModel = mongoose.model("Conversation", conversationSchema);

export default ConversationModel
