/**
 * @author Tirth Bharatiya (B00955618)
 */
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  useMediaQuery,
  Tooltip,
  Card,
  CardContent,
  Avatar,
  Button,
} from "@mui/material";
import { DiscussionModel } from "../../models/discussions.model";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { theme } from "../../utils/theme";
import moment from "moment";
import { formatContent } from "../../pages/discussions/discussion";

const DiscussionCard: React.FC<{ discussion: DiscussionModel }> = ({
  discussion,
}) => {
  const userId = sessionStorage.getItem("userId") ?? "";
  const discussionUrl = `/discussions/${discussion.id}`;
  const navigate = useNavigate(); 
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const formattedDate = moment(discussion?.timestamp).format("MMMM Do YYYY");
  const MAX_PREVIEW_LENGTH = 500;
  let contentPreview = discussion.content;

  // if the discussion content is longer than max length, slice it.
  if (discussion.content.length > MAX_PREVIEW_LENGTH) {
    const lastSpaceIndex = discussion.content.lastIndexOf(
      " ",
      MAX_PREVIEW_LENGTH
    );
    contentPreview = discussion.content.slice(0, lastSpaceIndex) + "...";
  }

  // format likes if the likes are >1000 convert it into 1k format.
  function formatLikeDislike(likeDislike: number): string {
    if (likeDislike >= 1000) {
      return (likeDislike / 1000).toFixed(1) + "k";
    }
    return likeDislike.toString();
  }

  return (
      <Card variant="outlined" sx={{ borderRadius: "10px" }}>
        <CardContent>
          <Box>
            <Box sx={{ display: "flex", flexDirection: isSmallScreen ? "column" : "row", justifyContent: "space-between", alignContent: "center" }}>
            {/* Title of discussion */}
            <Typography variant="h6">{discussion.title}</Typography>
            <Button variant="contained" onClick={() => {navigate(discussionUrl)}}>View discussion</Button>
            </Box>
            {/* formatted content */}
            <Typography>{formatContent(contentPreview)}</Typography>
            {/* Tags */}
            {discussion.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                style={{ marginRight: "5px", marginTop: "5px" }}
              />
            ))}
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingTop: isSmallScreen ? "15px" : "0px",
              }}
            >
              <Tooltip title="">
                <ThumbUp
                  color={
                    discussion?.likedBy.includes(userId) ? "primary" : "action"
                  }
                />
              </Tooltip>
              <Typography
                variant="body2"
                sx={{ marginLeft: "5px", marginRight: "10px" }}
              >
                {formatLikeDislike(discussion?.likedBy.length ?? 0)}
              </Typography>
              <Tooltip title="">
                <ThumbDown
                  color={
                    discussion?.dislikedBy.includes(userId)
                      ? "primary"
                      : "action"
                  }
                />
              </Tooltip>
              <Typography
                variant="body2"
                sx={{ marginLeft: "5px", marginRight: "10px" }}
              >
                {formatLikeDislike(discussion?.dislikedBy.length ?? 0)}
              </Typography>
            </Box>

            {/* Discussion start date and user information who started. Design inspired by: StackOverFlow (https://stackoverflow.com) */}
            <Box sx={{ paddingTop: isSmallScreen ? "15px" : "0px" }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ marginLeft: "auto" }}
              >
                Started {formattedDate}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {discussion.userImage ? (
                  <img
                    src={discussion.userImage}
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
                    alt="User Profile Avatar"
                    style={{
                      marginRight: "3px",
                      height: "40px",
                      width: "40px",
                    }}
                  >
                    {discussion.userName.charAt(0)}
                  </Avatar>
                )}
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  sx={{
                    maxWidth: "120px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {discussion!.userName}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
  );
};

export default DiscussionCard;
