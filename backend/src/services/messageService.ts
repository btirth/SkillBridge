
import mongoose  from 'mongoose';
import ConversationModel from '../models/conversation';
import MessageModel from '../models/message';
import { Conversation, Message } from '../types';


const getMessages = async (senderId: string, recieverId: string): Promise<Array<mongoose.Types.ObjectId>> => {
    const conversation = await ConversationModel
        .findOne({
            participants: { $all: [senderId, recieverId] },
        })
        .populate("messages")
        

    if (!conversation)
        return []

    return conversation.messages
}

const sendMessage = async (senderId: string, receiverId: string, message: string): Promise<Message> => {
    let conversation: Conversation | null = await ConversationModel.findOne({
        participants: { $all: [senderId, receiverId] }
    })

    if (!conversation) {
        conversation = await ConversationModel.create({ participants: [senderId, receiverId] })
    }

    const newMessage = new MessageModel({ senderId, receiverId, message })
    await newMessage.save()

    conversation.messages.push(newMessage._id)
    await ConversationModel.updateOne(
        { participants: { $all: [senderId, receiverId] } },
        conversation
    )

    return newMessage
}


export default {
    getMessages,
    sendMessage
}
