import { useEffect, useState } from "react"
import { MessageModel } from "../../models/message.model"
import { UserDetails } from "../../models/UserDetatils.model"
import axios from "axios"
import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material"
import { getMessages, sendMessage } from "../../pages/messages/Messages"
import io, { Socket } from "socket.io-client";
import Message from "./Message"

interface MessageContainerProps {
    recieverId: string
}

const BASE_URL = import.meta.env.VITE_BASE_URL

const Conversations: React.FC<MessageContainerProps> = ({ recieverId }) => {
    const [recieverDetails, setRecieverDetails] = useState<UserDetails>()
    const [messages, setMessages] = useState<MessageModel[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [socket, setSocket] = useState<Socket>()

    useEffect(() => {
        const getMessageDetails = async () => {
            try {
                const recieverData = await axios.get<UserDetails>(`${BASE_URL}/userDetails/${recieverId}`)
                setRecieverDetails({ ...recieverData.data })
            } catch (error) {
                console.error('Error fetching message details', error)
            }

            getMessages(recieverId)
                .then((response) => {
                    if (response.status === 200) {
                        setMessages(response.data)
                    }
                })
                .catch((error) => console.error("Unable to update mesages", error))
        }

        getMessageDetails()
        setSocket(io(BASE_URL, {
            query: {
                userId: sessionStorage.getItem("userId"),
            },
        }))

    }, [])

    useEffect(() => {
        socket?.on("newMessage", (data) => {
            setMessages([...messages!, data]);
        });
    }, [socket, messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        sendMessage(recieverId, newMessage)
            .then((response) => {
                if (response.status === 200) {
                    const updatedMessages = [...messages]
                    updatedMessages.push(response.data)
                    setMessages(updatedMessages)
                } else {
                    console.log("Error while saving ", response.status, response.data)
                }
            })
            .catch((error) => {
                console.error("Can't send message", error)
            })
    }

    return (
        <Card sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: " 5px", padding: "10px" }}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h3">{recieverDetails?.firstName}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ padding: "5px" }}>
                        <Box style={{ maxHeight: 400, overflow: 'auto' }}>
                            {messages.map((message) => (
                                <div key={message.createdAt.toString()}>
                                    <Message message={message.message} senderId={message.senderId} />
                                </div>
                            ))}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={11}>
                            <Box>
                                <TextField
                                    required
                                    placeholder="Send a message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    sx={{ display: "flex" }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: " 5px", padding: "5px" }}>
                                <Button variant="contained" onClick={handleSendMessage}>Send</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card >
    )
}
export default Conversations