/**
 * @author Tirth Bharatiya (B00955618)
 */
import {
  Card,
  CardContent,
  Typography,
  Box,
  useMediaQuery,
  IconButton,
  Tooltip,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import moment from "moment";
import { DiscussionReplyModel } from "../../models/discussions.model";
import { theme } from "../../utils/theme";
import { Delete } from "@mui/icons-material";
import React, { useState } from "react";
import { formatContent } from "../../pages/discussions/discussion";

const ReplyCard: React.FC<{
  discussionReply: DiscussionReplyModel;
  onDelete: (replyId: string) => void;
}> = ({ discussionReply, onDelete }) => {
  const userId = sessionStorage.getItem("userId") ?? "";
  const userCanDelete = discussionReply.userId === userId;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const formattedDate = moment(discussionReply.timestamp).format(
    "MMMM Do YYYY"
  );
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  // This function will call the callback function from props to delete the reply.
  const delteReply = () => {
    onDelete(discussionReply.id);
  };

  return (
    <>
    <Card variant="outlined" sx={{ marginBottom: "10px" }}>
      <CardContent>
        {/* User information and delete option if user is author of reply */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            justifyContent: "space-between",
          }}
        >
          {/* User information */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {discussionReply.userImage ? (
              <img
                src={discussionReply.userImage}
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
                style={{
                  marginRight: "3px",
                  height: "40px",
                  width: "40px",
                }}
              >
                {discussionReply.userName.charAt(0)}
              </Avatar>
            )}
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={
                isSmallScreen
                  ? {
                      maxWidth: "50px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }
                  : {}
              }
            >
              {discussionReply.userName}
            </Typography>
          </Box>
          {/* Conditional rendering of delete icon (visible if user is author of reply.)  */}
          {userCanDelete && (
            <Box>
              <Tooltip title="Delete">
                <IconButton
                  onClick={() => {setConfirmOpen(true)}}
                  color="primary"
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        {/* Reply text */}
        <Typography variant="body1" component="p" sx={{ marginBottom: "8px" }}>
          {formatContent(discussionReply.replyText)}
        </Typography>
        {/* Timestamp */}
        <Box sx={{ display: "flex", justifyItems: "flex-end" }}>
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ marginLeft: "auto" }}
          >
            {formattedDate}
          </Typography>
        </Box>
      </CardContent>
    </Card>

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
            Are you sure you want to delete this reply?
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
              delteReply();
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

export default ReplyCard;
