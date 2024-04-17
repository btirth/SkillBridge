/**
 * @author Tirth Bharatiya (B00955618)
 */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  Snackbar,
  SnackbarContent,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { ThumbUp, ThumbDown, Delete } from "@mui/icons-material";
import moment from "moment";
import { ChangeEvent, useEffect, useState } from "react";
import {
  DiscussionModel,
  NewDiscussionReplyModel,
} from "../../models/discussions.model";
import {
  fetchDiscussion,
  replyToDiscussion,
  deleteDiscussion,
  updateLikeDisLike,
  deleteReplyFromDiscussion,
  formatContent,
} from "./discussion";
import { useNavigate, useParams } from "react-router-dom";
import ReplyCard from "../../components/Discussion/ReplyCard";
import { theme } from "../../utils/theme";

const DiscussionView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { discussionId } = useParams<{ discussionId: string }>();
  const [discussion, setDiscussion] = useState<DiscussionModel>();
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState<string>("");
  const userId = sessionStorage.getItem("userId") ?? "";
  const formattedDate = moment(discussion?.timestamp).format("MMMM Do YYYY");
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const userCanDelete = discussion?.userId === userId;
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  // function to make the API call to add reply in discussion
  const addReply = () => {
    const newDiscussionReply: NewDiscussionReplyModel = {
      userId,
      replyText,
      timestamp: new Date(),
    };

    if (replyText.trim() === "") {
      setError("Reply cannot be empty.");
      return;
    }

    setError("");
    replyToDiscussion(discussionId!, newDiscussionReply)
      .then((response) => {
        if (response.status === 200) {
          setDiscussion(response.data);
          setReplyText("");
        } else {
          setErrorFeebackMessage();
        }
      })
      .catch(() => {
        setErrorFeebackMessage();
      });
  };

  // function to update reply text.
  const updateReplyText = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setReplyText(event.target.value);
  };

  // user can like or remove like on discussion
  const addOrRemoveLikeDislike = (action: string) => {
    updateLikeDisLike(discussionId!, userId, action)
      .then((response) => {
        if (response.status === 200) {
          setDiscussion(response.data);
        } else {
          setErrorFeebackMessage();
        }
      })
      .catch(() => {
        setErrorFeebackMessage();
      });
  };

  // delete the discussion if the discussion is started by logged in user.
  const handleDelete = () => {
    deleteDiscussion(discussionId!)
      .then((response) => {
        if (response.status === 200) {
          navigate("/discussions");
        } else {
          setErrorFeebackMessage();
        }
      })
      .catch(() => {
        setErrorFeebackMessage();
      });
  };

  const setErrorFeebackMessage = () => {
    setFeedbackMessage("Something went wrong. Try again later...");
  };

  // format likes if the likes are >1000 convert it into 1k format.
  function formatVotes(likes: number): string {
    if (likes >= 1000) {
      return (likes / 1000).toFixed(1) + "k";
    }
    return likes.toString();
  }

  useEffect(() => {
    fetchDiscussion(discussionId!)
      .then((response) => {
        if (response.status === 200) {
          setDiscussion(response.data);
        } else {
          setErrorFeebackMessage();
        }
      })
      .catch(() => {
        setErrorFeebackMessage();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [discussionId]);

  /*
        discussion header represents main content of the discussion, it depends more on discussion that's why it's written here 
        Converted to different component to improve code readability. 
    */
  const DiscussionHeader = () => {
    return (
      <Box sx={{ marginBottom: 2}}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            {discussion?.title}
          </Typography>
          {userCanDelete && (
            <Tooltip title="Delete">
              <IconButton
                onClick={() => {setConfirmOpen(true)}}
                color="primary"
                aria-label="delete"
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Typography variant="body1" gutterBottom>
          {formatContent(discussion!.content ?? "")}
        </Typography>
        {/* Discussion tags */}
        <Box sx={{ marginTop: 1, display: "flex", alignItems: "center" }}>
          <Box>
            {discussion?.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                sx={{ marginRight: 1, marginBottom: 1 }}
              />
            ))}
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            alignItems: isSmallScreen ? "flex-start" : "center",
            justifyContent: isSmallScreen ? "flex-start" : "space-between",
          }}
        >
          {/* Likes and disliked on the discussion */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() =>
                addOrRemoveLikeDislike(
                  discussion?.likedBy.includes(userId) ? "remove-like" : "like"
                )
              }
              color={
                discussion?.likedBy.includes(userId) ? "primary" : "default"
              }
            >
              <ThumbUp />
            </IconButton>
            <Typography variant="body2" sx={{ marginRight: "8px" }}>
              {formatVotes(discussion?.likedBy.length ?? 0)}
            </Typography>
            <IconButton
              onClick={() =>
                addOrRemoveLikeDislike(
                  discussion?.dislikedBy.includes(userId)
                    ? "remove-dislike"
                    : "dislike"
                )
              }
              color={
                discussion?.dislikedBy.includes(userId) ? "primary" : "default"
              }
            >
              <ThumbDown />
            </IconButton>
            <Typography variant="body2" sx={{ marginRight: "8px" }}>
              {formatVotes(discussion?.dislikedBy.length ?? 0)}
            </Typography>
          </Box>
          {/* Discussion start date and user info who started. Design inspired by: StackOverFlow (https://stackoverflow.com) */}
          <Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ marginLeft: "auto" }}
            >
              Started {formattedDate}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {discussion!.userImage ? (
                <img
                  src={discussion!.userImage}
                  alt="User Profile Image"
                  style={{
                    marginRight: "3px",
                    height: "40px",
                    width: "40px",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <Avatar
                  style={{ marginRight: "3px", height: "40px", width: "40px" }}
                >
                  {discussion!.userName.charAt(0)}
                </Avatar>
              )}

              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={
                  isSmallScreen
                    ? {
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }
                    : {}
                }
              >
                {discussion!.userName}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  // Reply list component
  const ReplyList = () => {
    // Delete the reply and give user feedback if something went wrong.
    const deleteReply = (replyId: string) => {
      deleteReplyFromDiscussion(discussionId!, replyId)
        .then((response) => {
          if (response.status === 200) {
            setDiscussion(response.data);
          } else {
            setErrorFeebackMessage();
          }
        })
        .catch(() => {
          setErrorFeebackMessage();
        });
    };

    if (discussion?.replies.length === 0) {
      return (
        <Box>
          <Typography variant="h6">Be the first to reply!</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {discussion?.replies.map((reply, index) => (
          <div key={index}>
            <ReplyCard
              key={index}
              discussionReply={reply}
              onDelete={deleteReply}
            />
          </div>
        ))}
      </Box>
    );
  };

  // Input box to add a reply on a discussion
  const AddReply = () => {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="h2">
            Reply to Discussion
          </Typography>
          <TextField
            id="outlined-multiline-static"
            label="Your Reply"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            margin="normal"
            value={replyText}
            onChange={updateReplyText}
            error={!!error}
            helperText={error}
          />
          <Button variant="contained" color="primary" onClick={addReply}>
            Post
          </Button>
        </CardContent>
      </Card>
    );
  };

  // if discussion is still loading, show the loader to the user.
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          minHeight: "100vh"
        }}
      >
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <DiscussionHeader />
        <Typography variant="h5">Replies</Typography>
        <ReplyList />
        {/* https://stackoverflow.com/questions/42573017/in-react-es6-why-does-the-input-field-lose-focus-after-typing-a-character */}
        {AddReply()}
      </Box>
      {/* Snackbar to provide user feedback */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={!!feedbackMessage}
        autoHideDuration={6000}
        onClose={() => setFeedbackMessage("")}
      >
        <SnackbarContent message={feedbackMessage} />
      </Snackbar>

      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this discussion?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
          color="error"
            onClick={() => {
              setConfirmOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              handleDelete();
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DiscussionView;
