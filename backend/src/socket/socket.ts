import { Server } from "socket.io";
import http from "http";
import express from "express";
import config from '../utils/config';

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: [config.FRONTEND_ORIGIN],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId: string): any => {
	return userSocketMap[receiverId];
};

interface Dic {
    [key: string]: Object
}

let userSocketMap: Dic = {}

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId!! as string
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };