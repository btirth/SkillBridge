import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Paper,
  Chip,
  OutlinedInput,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import AvailabilityComponent from "../../components/AvailabilityComponent/AvailabilityComponent";
import {
  validateAreaOfExpertise,
  validateDateOfBirth,
  validateEmail,
  validateExperience,
  validateFile,
  validateFirstName,
  validateGender,
  validateLastName,
  validatePhoneNumber,
  validateTerms,
} from "../../utils/MentorFormValidations";
import PaymentSuccessDialog from "../../components/payment-success-dialog/PaymentSuccessDialog";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const subjects = [
  "Data Science",
  "Python",
  "Machine Learning",
  "Web Development",
  "JavaScript",
  "React",
  "UI/UX Design",
  "Figma",
  "Adobe XD",
  "Cloud Computing",
  "AWS",
  "Azure",
  "Graphic Design",
  "Illustrator",
  "Photoshop",
  "Cybersecurity",
  "Network Security",
  "Ethical Hacking",
  "Mobile App Development",
  "Flutter",
  "React Native",
  "Big Data",
  "Hadoop",
  "Spark",
  "SEO",
  "Digital Marketing",
  "Content Writing",
  "Project Management",
  "Agile",
  "Scrum",
];

const initialSchedule: DaySchedule[] = [
  { day: "Monday", from: "00:00", to: "00:00", isActive: false },
  { day: "Tuesday", from: "00:00", to: "00:00", isActive: false },
  { day: "Wednesday", from: "00:00", to: "00:00", isActive: false },
  { day: "Thursday", from: "00:00", to: "00:00", isActive: false },
  { day: "Friday", from: "00:00", to: "00:00", isActive: false },
  { day: "Saturday", from: "00:00", to: "00:00", isActive: false },
  { day: "Sunday", from: "00:00", to: "00:00", isActive: false },
];

const ApplyMentor = observer(() => {
  const navigate = useNavigate();
  const { userStore } = useStores();
  const { userDetails } = userStore;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [experience, setExperience] = useState(0);
  const [pay, setPay] = useState(0);
  const [areaOfExpertise, setAreaOfExpertise] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [file, setFile] = useState<string | ArrayBuffer>();
  const [fileDisplayName, setFileDisplayName] = useState<string>("");
  const [gender, setGender] = useState("");
  const [availability, setAvailability] =
    useState<DaySchedule[]>(initialSchedule);
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(null);

  const [register, setRegister] = useState(false);

  const [formErrors, setFormErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phoneNumber: "",
    experience: "",
    areaOfExpertise: "",
    availability: "",
    file: "",
    terms: "",
  });

  useEffect(() => {
    setFirstName(userDetails?.firstName ?? "");
    setLastName(userDetails?.lastName ?? "");
    setEmail(userDetails?.email ?? "");
  }, [userDetails]);

  const handleFirstNameChange = (newValue: string) => {
    setFirstName(newValue);
    setFormErrors((errors) => ({
      ...errors,
      firstName: validateFirstName(newValue),
    }));
  };

  const handleLastNameChange = (newValue: string) => {
    setLastName(newValue);
    setFormErrors((errors) => ({
      ...errors,
      lastName: validateLastName(newValue),
    }));
  };

  const handleGenderChange = (newValue: string) => {
    setGender(newValue);
    setFormErrors((errors) => ({
      ...errors,
      gender: validateGender(newValue),
    }));
  };

  const handleEmailChange = (newValue: string) => {
    setEmail(newValue);
    setFormErrors((errors) => ({ ...errors, email: validateEmail(newValue) }));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    setFormErrors((errors) => ({
      ...errors,
      dateOfBirth: validateDateOfBirth(newValue),
    }));
  };

  const handlePhoneNumberChange = (value: string) => {
    const newValue = parseInt(value, 10);
    setPhoneNumber(newValue);
    setFormErrors((errors) => ({
      ...errors,
      phoneNumber: validatePhoneNumber(newValue),
    }));
  };

  const handleExperienceChange = (value: string) => {
    const newValue = parseFloat(value);
    setExperience(newValue);
    setPay(newValue * 3.5);
    setFormErrors((errors) => ({
      ...errors,
      experience: validateExperience(newValue),
    }));
  };

  const handleTermsChange = (isChecked: boolean) => {
    setChecked(isChecked);
    setFormErrors((errors) => ({
      ...errors,
      terms: validateTerms(isChecked),
    }));
  };

  const handleAreaOfExpertiseChange = (
    event: SelectChangeEvent<typeof areaOfExpertise> | null,
    newValue: string[]
  ) => {
    if (event) {
      let newValue = event.target.value as string[];
      newValue =
        newValue && typeof newValue === "string"
          ? (newValue as string).split(",")
          : newValue;
      setAreaOfExpertise(newValue);
    }
    setFormErrors((errors) => ({
      ...errors,
      areaOfExpertise: validateAreaOfExpertise(newValue),
    }));
  };

  const handlePDF = (file: File | null) => {
    const fileError = validateFile(file);
    if (fileError !== "") {
      console.error(fileError);
      setFormErrors((errors) => ({ ...errors, file: fileError }));
      return;
    }
    if (file != null) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        if (e.target !== null && e.target.result !== null) {
          console.log(e.target.result);
          setFile(e.target.result.toString());
        }
      };

      reader.onerror = function (error) {
        console.log("Error reading file:", error);
      };
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const hasErrors = Object.values(formErrors).some(
      (errorMessage) => errorMessage !== ""
    );

    if (!hasErrors) {
      const formattedAvailability = availability
        .filter((a) => a.isActive)
        .map((a) => ({
          day: a.day,
          startTime: a.from,
          endTime: a.to,
        }));

      const formattedDate = selectedDate
        ? dayjs(selectedDate).format("DD - MM - YYYY")
        : "";

      let imageURL = "";
      if (gender == "Male") {
        imageURL =
          "https://randomuser.me/api/portraits/men/" +
          (Math.floor(Math.random() * 100) + 1) +
          ".jpg";
      } else if (gender == "Female") {
        imageURL =
          "https://randomuser.me/api/portraits/women/" +
          (Math.floor(Math.random() * 100) + 1) +
          ".jpg";
      }

      const ratings = "0";

      const mentorData = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dateOfBirth: formattedDate,
        imageUrl: imageURL,
        ratings: ratings,
        bio: bio,
        email: email,
        phoneNumber: phoneNumber.toString(),
        experience: experience.toString(),
        pay: pay.toString(),
        expertise: areaOfExpertise.join(", "),
        resume: file,
        availability: JSON.stringify(formattedAvailability),
        termsAccepted: checked.toString(),
      };

      console.log(mentorData);

      try {
        const response = await axios({
          method: "post",
          url: `${import.meta.env.VITE_BASE_URL}/mentor`,
          data: mentorData,
        });
        if (response.status === 200) {
          setRegister(true);
          setTimeout(() => {
            navigate("/mentors");
          }, 1000);
        }
        console.log(response.data);
      } catch (error) {
        console.error("Error submitting form", error);
      }
    }
  };

  return (
    <Grid container component="main">
      <PaymentSuccessDialog
        open={register}
        successText="Mentor Registration Successful"
      />
      <Typography variant="h5">Apply as a Mentor</Typography>
      <Divider />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper sx={{ padding: 2, borderRadius: "0.5rem" }} elevation={3}>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                  onBlur={(e) => handleFirstNameChange(e.target.value)}
                  error={Boolean(formErrors.firstName)}
                  helperText={formErrors.firstName}
                  disabled={!!userDetails?.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                  onBlur={(e) => handleLastNameChange(e.target.value)}
                  error={Boolean(formErrors.lastName)}
                  helperText={formErrors.lastName}
                  disabled={!!userDetails?.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    value={gender}
                    label="Gender"
                    onChange={(e) => handleGenderChange(e.target.value)}
                    onBlur={(e) => handleGenderChange(e.target.value)}
                    error={Boolean(formErrors.areaOfExpertise)}
                  >
                    <MenuItem value={"Male"}>Male</MenuItem>
                    <MenuItem value={"Female"}>Female</MenuItem>
                  </Select>
                  <FormHelperText color="error">
                    {formErrors.gender}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={(e) => handleEmailChange(e.target.value)}
                  error={Boolean(formErrors.email)}
                  helperText={formErrors.email}
                  disabled={!!userDetails?.email}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    sx={{ width: "100%" }}
                    value={selectedDate}
                    label="Date of Birth"
                    onChange={(newValue) => handleDateChange(newValue)}
                  />
                  <FormHelperText color="error">
                    {formErrors.dateOfBirth}
                  </FormHelperText>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  name="phone_number"
                  label="Phone Number"
                  type="number"
                  id="phone_number"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneNumberChange(e.target.value)}
                  onBlur={(e) => handlePhoneNumberChange(e.target.value)}
                  error={Boolean(formErrors.phoneNumber)}
                  helperText={formErrors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="bio"
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="experience"
                  label="Years of Experience"
                  type="number"
                  id="experience"
                  value={experience}
                  onChange={(e) => handleExperienceChange(e.target.value)}
                  onBlur={(e) => handleExperienceChange(e.target.value)}
                  error={Boolean(formErrors.experience)}
                  helperText={formErrors.experience}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="expertise-label">
                    Area of Expertise
                  </InputLabel>
                  <Select
                    labelId="expertise-label"
                    id="expertise"
                    name="expertise"
                    multiple
                    value={areaOfExpertise}
                    onChange={(e) =>
                      handleAreaOfExpertiseChange(e, areaOfExpertise)
                    }
                    onBlur={() =>
                      handleAreaOfExpertiseChange(null, areaOfExpertise)
                    }
                    error={Boolean(formErrors.areaOfExpertise)}
                    input={
                      <OutlinedInput
                        id="select-multiple-chip"
                        label="Area of Expertise"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {subjects.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText color="error">
                    {formErrors.areaOfExpertise}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <AvailabilityComponent
                    availability={availability}
                    setAvailability={setAvailability}
                    setFormErrors={setFormErrors}
                  />
                  <FormHelperText color="error">
                    {formErrors.availability}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <TextField
                    disabled
                    fullWidth
                    value={fileDisplayName ? fileDisplayName : "No file chosen"}
                    error={Boolean(formErrors.file)}
                    helperText={formErrors.file}
                    sx={{ mr: 2 }}
                  />
                  <input
                    id="upload-button-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      const files = event.target.files;
                      if (files && files.length > 0) {
                        handlePDF(files[0]);
                        const selectedFile = files[0];
                        setFileDisplayName(selectedFile.name);
                      }
                    }}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="upload-button-file">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<CloudUploadOutlined />}
                      sx={{ height: "56px" }}
                    >
                      Upload
                    </Button>
                  </label>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => handleTermsChange(e.target.checked)}
                      onBlur={() => handleTermsChange(checked)}
                      color="primary"
                    />
                  }
                  label="I agree to the Terms and Conditions*"
                />
                {formErrors.terms && (
                  <Typography color="error">{formErrors.terms}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
});

export default ApplyMentor;
