import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import PhoneIcon from "@mui/icons-material/Phone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../utils/theme";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function ContactUsPage() {
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);

  const handleEmailChange = (event: any) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const validateEmail = (email: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const username = email.split("@")[0];
    const startsWithSpecialChar = /^[^a-zA-Z0-9]/.test(username);
    const endsWithSpecialChar = /[^a-zA-Z0-9]$/.test(username);

    if (
      !emailRegex.test(email) ||
      startsWithSpecialChar ||
      endsWithSpecialChar
    ) {
      setErrorMessage(
        "Please enter a valid email address without special characters at the beginning or end of the username."
      );
      setIsSubmitDisabled(true);
    } else {
      setErrorMessage("");
      setIsSubmitDisabled(false);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log({
      email,
      message: event.currentTarget.elements.namedItem("message").value,
    });

    // Show snackbar
    setShowSnackbar(true);

    // Clear input fields
    setEmail("");
    const emailField = event.currentTarget.elements.namedItem("email");
    const messageField = event.currentTarget.elements.namedItem("message");
    if (emailField && messageField) {
      emailField.value = "";
      messageField.value = "";
    }
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  const defaultTheme = theme;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <CssBaseline />
        <Grid container component="main" sx={{ flexGrow: 1 }}>
          <Grid
            item
            xs={12}
            sm={4}
            md={7}

            sx={{
              backgroundColor: "#cfd6db",
              py: 8,
              px: 6,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}
            >
              Welcome to SkillBridge
            </Typography>
            <Typography variant="body1" gutterBottom>
              We're here to help you enhance your skills and connect with
              professionals.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1" gutterBottom>
                SkillRidge HQ - 123 SkillRidge Ave.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body1" gutterBottom>
                555-123-456
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                maxWidth: { xs: "100%", sm: 300 },
              }}
            >
              <MailOutlineIcon sx={{ mr: 1 }} />
              <Typography variant="body1" gutterBottom>
                support@skillBridge.com
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <MailOutlineIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Contact Us
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleEmailChange}
                  error={!!errorMessage}
                  helperText={errorMessage}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  id="message"
                  label="Message"
                  name="message"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "#071541" }}
                  disabled={isSubmitDisabled}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* Snackbar */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thanks for contacting us! We will get back to you soon.
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default ContactUsPage;
