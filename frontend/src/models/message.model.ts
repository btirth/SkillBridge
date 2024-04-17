export interface MessageModel {
    senderId: string,
    receiverId: string,
    message: string,
    createdAt: Date
}

export interface ConversationModel {
    receiverId: string,
    recieverName: string,
}