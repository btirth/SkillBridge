/**
 * @author Drashti Navadiya (B00948838)
 */
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import {
  UserCredential,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignIn() {
  const [, setEmail] = useState("");

  const navigate = useNavigate();
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential: UserCredential) => {
          const user = userCredential.user;
          sessionStorage.setItem("userId", user.uid);
          user.getIdToken().then((accessToken) => {
            sessionStorage.setItem("accessToken", accessToken);
          });
          sessionStorage.setItem("email", email);
          sessionStorage.setItem("isLoggedIn", "true");
          navigate("/dashboard");

          console.log("User signed in successfully!");
          toast.success("Signed in successfully!");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (error) {
      let errorMessage = "Error signing in:";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.log(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: 1,
          borderRadius: 4,
          p: 3,
          px: 3,
        }}
      >
        <Avatar sx={{ m: 2, bgcolor: "primary.main" }}>
          <PeopleAltSharpIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome to the Community
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            onChange={handleEmailChange}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            color="primary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign-up" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
}
