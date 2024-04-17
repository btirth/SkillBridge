import { useEffect, useState } from "react";
import { MessageModel } from "../../models/message.model";
import { UserDetails } from "../../models/UserDetatils.model";
import axios from "axios";
import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { getMessages, sendMessage } from "../../pages/messages/Messages";
import io, { Socket } from "socket.io-client";
import Message from "./Message";

interface MessageContainerProps {
  recieverId: string;
}
const BASE_URL = import.meta.env.VITE_BASE_URL;

const MessageContainer: React.FC<MessageContainerProps> = ({ recieverId }) => {
  const [recieverDetails, setRecieverDetails] = useState<UserDetails>();
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const getMessageDetails = async () => {
      try {
        const recieverData = await axios.get<UserDetails>(
          `${BASE_URL}/userDetails/${recieverId}`
        );
        setRecieverDetails({ ...recieverData.data });
      } catch (error) {
        console.error("Error fetching message details", error);
      }

      getMessages(recieverId)
        .then((response) => {
          if (response.status === 200) {
            setMessages(response.data);
          }
        })
        .catch((error) => console.error("Unable to update mesages", error));
    };

    getMessageDetails();
    setSocket(
      io(BASE_URL, {
        query: {
          userId: sessionStorage.getItem("userId"),
        },
      })
    );
  }, [recieverId]);

  useEffect(() => {
    socket?.on("newMessage", (data) => {
      setMessages([...messages!, data]);
    });
  }, [socket, messages]);

  const sendMessageHandler = async () => {
    await sendMessage(recieverId, newMessage)
      .then((response) => {
        if (response.status === 200) {
          const updatedMessages = [...messages];
          updatedMessages.push(response.data);
          setMessages(updatedMessages);
          setNewMessage("");
        } else {
          console.log("Error while saving ", response.status, response.data);
        }
      })
      .catch((error) => {
        console.error("Can't send message", error);
      });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageHandler();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const code = e.code;
    if (code === "Enter") {
      sendMessageHandler();
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: " 5px",
        padding: "10px",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h3">{recieverDetails?.firstName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ padding: "5px" }}>
            <Box style={{ height: 500, overflow: "auto" }}>
              {messages.map((message) => (
                <div key={message.createdAt.toString()}>
                  <Message
                    message={message.message}
                    senderId={message.senderId}
                  />
                </div>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={10}>
              <Box>
                <TextField
                  required
                  placeholder="Send a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyUpCapture={handleKeyUp}
                  sx={{ display: "flex" }}
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Button variant="contained" onClick={handleSendMessage}>
                  Send
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};
export default MessageContainer;
