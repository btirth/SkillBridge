import { useEffect, useState } from "react";
import MessageContainer from "../../components/messages/MessageContainer";
import {
  Box,
  Card,
  Grid,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { ConversationModel } from "../../models/message.model";
import { getConversations } from "./Messages";
import { useLocation } from "react-router-dom";

const MessageDashboard: React.FC = () => {
  const [currentRecieverId, setCurrentRecieverId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<ConversationModel[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { state } = useLocation();

  useEffect(() => {
    setLoading(true);
    if (state && state.receiverId) {
      setCurrentRecieverId(state.receiverId)
    }
    getConversations()
      .then((newConversations) => {
        setConversations(newConversations);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Unable to get conversations", error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleConversationChange = (recieverId: string) => {
    setCurrentRecieverId(recieverId);
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.recieverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Paper sx={{ minHeight: 600 }}>
        <Grid container>
          <Grid item xs={4}>
            <Box sx={{ height: "100%", width: "100%" }}>
              <Grid container>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "5px",
                      padding: "10px",
                    }}
                  >
                    <TextField
                      label="Search conversations"
                      variant="outlined"
                      fullWidth
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {isLoading
                    ? [1, 2].map((value, index) => {
                      return (
                        <Skeleton
                          sx={{ mb: 1 }}
                          key={"message-" + value + index}
                          variant="rectangular"
                          height={50}
                        />
                      );
                    })
                    : filteredConversations &&
                      filteredConversations.map((conversation) => (
                        <Card
                          sx={{
                            display: "flex",
                            justifyContent: "left",
                            padding: "10px",
                            mx: 1,
                            cursor: "pointer",
                            mb: 1,
                            ":hover": {
                              backgroundColor: "#e2e2e2",
                            },
                          }}
                          key={conversation.receiverId}
                          onClick={() =>
                            handleConversationChange(conversation.receiverId)
                          }
                        >
                          <Typography variant="h5">
                            {conversation.recieverName}
                          </Typography>
                        </Card>
                      ))}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Box>
              {currentRecieverId.length !== 0 && (
                <MessageContainer recieverId={currentRecieverId} />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default MessageDashboard;
