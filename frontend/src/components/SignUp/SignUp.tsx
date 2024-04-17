/**
 * @author Drashti Navadiya (B00948838)
 */
import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  profession: string;
  dob: Date | null;
  image: string;
}

export default function SignUp() {
  const [imageB64, setImageB64] = useState<string | ArrayBuffer>();
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<SignUpFormData>({
    mode: "onChange",
  });

  const password = React.useRef({});

  password.current = getValues("password");

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required";
    }
    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }
    const capitalRegex = /[A-Z]/;
    const smallRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;

    if (!capitalRegex.test(value)) {
      return "Password must contain at least one capital letter";
    }
    if (!smallRegex.test(value)) {
      return "Password must contain at least one small letter";
    }
    if (!specialCharRegex.test(value)) {
      return "Password must contain at least one special character";
    }
    if (!numberRegex.test(value)) {
      return "Password must contain at least one number";
    }
    return true;
  };

  const handleImage = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      if (e.target !== null && e.target.result !== null) {
        console.log(e.target.result);
        setImageB64(e.target.result);
      }

      console.log(typeof file);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        companyName,
        profession,
        dob,
      } = data;
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;

          const userDetails = {
            uid: uid,
            email: email,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            profession: profession,
            companyName: companyName,
            image: imageB64,
          };

          axios
            .post(
              `${import.meta.env.VITE_BASE_URL}/userDetails/add`,
              userDetails
            )
            .then((response) => {
              if (response.status === 201) {
                toast.success("User account has been created.");
                sessionStorage.setItem("userId", uid);
                user.getIdToken().then((accessToken) => {
                  sessionStorage.setItem("accessToken", accessToken);
                });
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("isLoggedIn", "true");
                reset();
                navigate("/dashboard");
                setLoading(false);
              } else {
                toast.error(
                  "Unexpected response status code: " + response.status
                );
              }
            })
            .catch((error) => {
              setLoading(false);
              if (error.response && error.response.status === 409) {
                toast.error("Account with this email already exists");
              } else {
                console.error("Error:", error);
              }
            });
        })
        .catch((error) => {
          setLoading(false);
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } catch (error) {
      let errorMessage = "Error signing up:";
      if (error instanceof Error) {
        errorMessage = error.message;
        toast.error(errorMessage);
      }
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
        <Typography component="h1" variant="h5" align="center">
          Optimize Your Professional Life for Maximum Impact
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                {...register("firstName", {
                  required: "First name is required",
                })}
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
              {errors.firstName && (
                <Typography color="error">
                  {errors.firstName.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register("lastName", { required: "Last name is required" })}
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
              />
              {errors.lastName && (
                <Typography color="error">{errors.lastName.message}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
              {errors.email && (
                <Typography color="error">{errors.email.message}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("password", { validate: validatePassword })}
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
              {errors.password && (
                <Typography color="error">{errors.password.message}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                })}
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <Typography color="error">
                  {errors.confirmPassword.message}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register("companyName")}
                fullWidth
                id="companyName"
                label="Company Name"
                name="companyName"
                autoComplete="company-name"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                {...register("profession")}
                fullWidth
                id="profession"
                label="Profession"
                name="profession"
                autoComplete="profession"
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker", "DatePicker"]}>
                  <DatePicker label="Date of Birth" defaultValue={dayjs()} />
                </DemoContainer>
              </LocalizationProvider>

              {errors.dob && (
                <Typography color="error">{errors.dob.message}</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Upload Profile Photo
              </Typography>
              <input
                {...register("image")}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const files = event.target.files;
                  if (files && files.length > 0) {
                    handleImage(files[0]);
                    const selectedFile = files[0];
                    console.log(selectedFile);
                  }
                }}
              />
            </Grid>
          </Grid>
          <LoadingButton
            loading={isLoading}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
}
