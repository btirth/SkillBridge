import express from 'express'
import logger from '../utils/logger'
import messageService from '../services/messageService'
import { getReceiverSocketId, io } from '../socket/socket'

const messageRouter = express.Router()

messageRouter.get('/:id', (request, response) => {
    const receiverId: string = request.params.id
    const userId: string = request.header('userId')!!

    messageService
        .getMessages(userId, receiverId)
        .then(messages => {
            if (messages === null) {
                response.status(404).send({ error: 'Not found!' })
            }
            else {
                response.send(messages)
            }
        })
        .catch(
            (error: any) => logger.error("Unable to fetch messages", error)
        )
})

messageRouter.post('/:id', (request, response) => {
    const receiverId: string = request.params.id
    const userId: string = request.header('userId')!!
    const message: string = request.body.message

    messageService
        .sendMessage(userId, receiverId, message)
        .then(message => {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", message);
            }
            response.send(message)
        })
        .catch(error => logger.error("Unable to insert new message", error))
})

export default messageRouter