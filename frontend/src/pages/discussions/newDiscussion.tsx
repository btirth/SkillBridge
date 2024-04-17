/**
 * @author Tirth Bharatiya (B00955618)
 */
import {
  Button,
  Typography,
  Box,
  Chip,
  Snackbar,
  SnackbarContent,
  Tooltip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  NewDiscussionFormDataModel,
  NewDiscussionSubmitDataModel,
  NewDiscussionValidationErrorModel,
} from "../../models/discussions.model";
import { startDiscussion } from "./discussion";

const NewDiscussion = () => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState<string>("");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const userId = sessionStorage.getItem("userId");
  const [formData, setFormData] = useState<NewDiscussionFormDataModel>({
    title: "",
    content: "",
    tags: [],
  });
  const [validationErrors, setValidationErrors] =
    useState<NewDiscussionValidationErrorModel>({
      title: "",
      content: "",
      tags: "",
    });
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  // function responsible to navigate user back to discussions page.
  const navigateBackToDiscussions = () => {
    navigate("/discussions");
  };

  // function to update the user inputs
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // function to add tags on "," and Enter.
  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "," || event.key === "Enter") {
      event.preventDefault();
      addTag();
    }
  };

  // function validates for duplicate and maximum 5 tags and then adds in the tags.
  const addTag = () => {
    const tag = tagInput.trim();
    if (formData.tags.length === 5) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        tags: "You can only choose up to 5 tags.",
      }));
    } else if (tag && !formData.tags.includes(tag)) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tags: [...prevFormData.tags, tag],
      }));
      setTagInput("");
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        tags: "",
      }));
    }
  };

  // function to remove the tag from the tags list.
  const deleteTag = (tagToDelete: string) => () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: prevFormData.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  // function responsible to validate form details.
  const validateForm = () => {
    const errors: Partial<NewDiscussionValidationErrorModel> = {};
    if (formData.title.trim().length < 5 || formData.title.trim().length > 50) {
      errors.title = "Title must be at least 5 and up to 50 characters long.";
    }
    if (
      formData.content.trim().length < 30 ||
      formData.content.trim().length > 30000
    ) {
      errors.content =
        "content must be at least 30 and up to 30000 characters long.";
    }
    if (formData.tags.length === 0) {
      errors.tags = "Please add at least one tag.";
    }
    setValidationErrors(errors as NewDiscussionValidationErrorModel);
    return Object.keys(errors).length === 0;
  };

  // function responsible to create a new discussion.
  const submitDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    const newDiscussionData: NewDiscussionSubmitDataModel = {
      title: formData.title,
      userId: userId!,
      content: formData.content,
      tags: formData.tags,
    };

    // make API call to backend to create a discussion.
    startDiscussion(newDiscussionData)
      .then((response) => {
        // if discussion created successfully, give user feedback and redirect user to discussions page (list of discussions).
        if (response.status === 200) {
          setFeedbackMessage("Discussion created successfully.");
          setTimeout(() => {
            navigateBackToDiscussions();
          }, 2000);
        } else {
          setFeedbackMessage("Something went wrong. Please try again later.");
        }
      })
      .catch(() => {
        setFeedbackMessage("Something went wrong. Please try again later.");
      });
  };

  // keeps checking for errors for better use experience
  useEffect(() => {
    if (
      formData.title.length >= 5 &&
      formData.title.length <= 30 &&
      validationErrors.title
    ) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        title: "",
      }));
    }

    if (
      formData.content.length >= 30 &&
      formData.content.length <= 30000 &&
      validationErrors.content
    ) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        content: "",
      }));
    }
  }, [formData, validationErrors]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", textAlign: "center" }}
        >
          <Typography variant="h4">Start a Conversation</Typography>
          <Typography variant="h6">
            Share Your Ideas, Ask Questions, and Connect with the Community
          </Typography>
        </Box>

        {/* Title input */}
        <Box sx={{ ...discussionInputCard }}>
          <Typography variant="h6">Title</Typography>
          <Typography variant="body1">
            Be specific while choosing a title for your discussion
          </Typography>
          <TextField
            required
            placeholder="Choose a title 5 to 50 characters long."
            value={formData.title}
            error={!!validationErrors.title}
            helperText={validationErrors.title}
            sx={{ paddingTop: "10px" }}
            onChange={(e) => handleInputChange(e, "title")}
          />
        </Box>

        {/* content multiline input */}
        <Box sx={{ ...discussionInputCard }}>
          <Typography variant="h6">Description</Typography>
          <Typography variant="body1">
            Share your thoughts, questions, or ideas here
          </Typography>
          <TextField
            multiline
            rows="8"
            placeholder="Be specific as possible"
            required
            error={!!validationErrors.content}
            helperText={validationErrors.content}
            value={formData.content}
            sx={{ paddingTop: "10px" }}
            onChange={(e) => handleInputChange(e, "content")}
          />
        </Box>

        {/* Tags input */}
        <Box sx={{ ...discussionInputCard }}>
          <Typography variant="h6">Tags</Typography>
          <Typography variant="body1">
            Choose up to 5 tags for your discussion to increase visibility.
          </Typography>
          <div style={{ marginTop: "10px" }}>
            {formData.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={deleteTag(tag)}
                style={{ margin: "5px" }}
              />
            ))}
          </div>
          <Tooltip
            title={
              formData.tags.length === 5 ? "You can only add up to 5 tags." : ""
            }
            arrow
          >
            <TextField
              required
              sx={{ borderColor: validationErrors.tags ? "red" : "black" }}
              placeholder="Add tags separated by commas to describe your discussion"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              disabled={formData.tags.length === 5}
              error={!!validationErrors.tags}
              helperText={validationErrors.tags}
            />
          </Tooltip>
        </Box>

        {/* POST and CANCEL Button */}
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            onClick={() => {
              if (validateForm()) {
                setConfirmOpen(true);
              }
            }}
          >
            POST
          </Button>
          <Button variant="contained" onClick={navigateBackToDiscussions}>
            CANCEL
          </Button>
        </Box>
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
            Are you sure you want to start this discussion?
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
            onClick={(e) => {
              setConfirmOpen(false);
              submitDiscussion(e);
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

const discussionInputCard = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "800px",
};

export default NewDiscussion;
