/**
 * @author Om Anand (B00947378)
 */
import {
  Button,
  Typography,
  Box,
  Snackbar,
  SnackbarContent,
  TextField,
  SelectChangeEvent,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "./job";
import {
  NewJobData,
  NewJobErrorData,
  experienceLevels,
  jobTypes,
  locationProvinces,
} from "../../models/jobs.model";
import { InputTitle } from "../../components/inputs/inputTitle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InputSelect } from "../../components/inputs/select";
import { InputTextSingleLine } from "../../components/inputs/singleLine";
import { InputTextMultiLine } from "../../components/inputs/multiLine";
import JobDetailComponent from "../../components/job/jobDetailComponent";

const NewJob = () => {
  const navigate = useNavigate();
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const userId = sessionStorage.getItem("userId");
  const [formData, setFormData] = useState<NewJobData>({
    title: "",
    description: "",
    companyDetails: "",
    createDate: new Date(),
    experienceLevel: experienceLevels.associate,
    type: jobTypes.fullTime,
    userId: userId!,
    city: "",
    province: locationProvinces.ON,
  });
  const [validationErrors, setValidationErrors] = useState<NewJobErrorData>({
    title: "",
    description: "",
    companyDetails: "",
    createDate: "",
    experienceLevel: "",
    type: "",
    userId: "",
    city: "",
    province: "",
  });
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigateBackToJobs = () => {
    navigate("/jobs");
  };

  // function to update the user inputs
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<any>,
    field: string
  ) => {
    const value = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleDayChange = (day: Dayjs | null, field: string) => {
    const value = day?.toDate();
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  // function responsible to validate form details.
  const validateForm = () => {
    const errors: Partial<NewJobErrorData> = {};

    if (formData.title.trim().length < 5 || formData.title.trim().length > 50) {
      errors.title = "Title must be at least 5 and up to 50 characters long.";
    }
    if (
      formData.description.trim().length < 30 ||
      formData.description.trim().length > 30000
    ) {
      errors.description =
        "Description must be at least 30 and up to 30000 characters long.";
    }
    if (
      formData.companyDetails.trim().length < 30 ||
      formData.companyDetails.trim().length > 30000
    ) {
      errors.companyDetails =
        "Company Details must be at least 30 and up to 30000 characters long.";
    }
    if (formData.city.trim().length < 3 || formData.city.trim().length > 50) {
      errors.city =
        "City name must be at least 3 and up to 50 characters long.";
    }
    setValidationErrors(errors as NewJobErrorData);
    return Object.keys(errors).length === 0;
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      setConfirmCreateOpen(true)
    }
  }

  const submitJob = () => {
    setIsLoading(true)
    createJob(formData)
      .then((response) => {
        setIsLoading(false)
        if (response.status === 200) {
          setFeedbackMessage("Job created successfully.");
          setTimeout(() => {
            navigateBackToJobs();
          }, 2000);
        } else {
          console.log("Error while saving ", formData);
          setFeedbackMessage("Something went wrong. Please try again later.");
        }
      })
      .catch(() => {
        setIsLoading(false)
        setFeedbackMessage("Something went wrong. Please try again later.");
      });
  };

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
          <Typography variant="h4">Post a job</Typography>
          <Typography variant="h6">
            Let us help you find your next hire
          </Typography>
        </Box>

        {/* Title input */}
        <Box sx={{ ...textInputCard }}>
          <InputTitle
            title="Title"
            description="Be specific while choosing a title for your job"
          />
          <InputTextSingleLine
            placeHolder="Choose a title 5 to 20 characters long."
            value={formData.title}
            errorMessage={validationErrors.title}
            onChange={(e) => handleInputChange(e, "title")}
          />

          {/* Description multiline input */}
          <InputTitle
            title="Description"
            description="Share details about the job and its qualification"
          />
          <InputTextMultiLine
            placeHolder="Be as specific as possible"
            value={formData.description}
            errorMessage={validationErrors.description}
            onChange={(e) => handleInputChange(e, "description")}
          />

          {/* Company Details input */}
          <InputTitle
            title="Company Details"
            description="Tell us about your workplace, benefits and more"
          />
          <TextField
            multiline
            rows="8"
            placeholder="Highlight your commitments, goals and benefits"
            required
            error={!!validationErrors.companyDetails}
            helperText={validationErrors.companyDetails}
            value={formData.companyDetails}
            sx={{ paddingTop: "10px" }}
            onChange={(e) => handleInputChange(e, "companyDetails")}
          />

          <Stack direction="row">
            {/* Job type select */}
            <Box sx={{ ...internalCard }}>
              <InputTitle title="Type" description="Type of work" />
              <InputSelect
                value={formData.type}
                onChange={(e) => handleInputChange(e, "type")}
                enumValues={jobTypes}
              />
            </Box>

            {/* Experience level select */}
            <Box sx={{ ...internalCard }}>
              <InputTitle title="Experience" description="Position level" />
              <InputSelect
                value={formData.experienceLevel}
                onChange={(e) => handleInputChange(e, "experienceLevel")}
                enumValues={experienceLevels}
              />
            </Box>
          </Stack>
          {/* Expected creation date select */}

          <InputTitle title="Job creation date" description="" />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Create Date"
              defaultValue={dayjs()}
              value={dayjs(formData.createDate)}
              onChange={(e) => handleDayChange(e, "createDate")}
            />
          </LocalizationProvider>

          <Stack direction="row">
            {/* City input */}
            <Box sx={{ ...internalCard }}>
              <InputTitle title="City" description="" />
              <TextField
                required
                placeholder="Enter a city 5 to 30 characters long."
                value={formData.city}
                error={!!validationErrors.city}
                helperText={validationErrors.city}
                sx={{ paddingTop: "10px" }}
                onChange={(e) => handleInputChange(e, "city")}
              />
            </Box>
            {/* Province select */}
            <Box sx={{ ...internalCard }}>
              <InputTitle title="Province" description="" />
              <InputSelect
                value={formData.province}
                onChange={(e) => handleInputChange(e, "province")}
                enumValues={locationProvinces}
              />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button variant="contained" onClick={handleInitialSubmit}>
            Create
          </Button>
          <Dialog open={confirmCreateOpen} onClose={() => setConfirmCreateOpen(false)}>
            <DialogTitle>Confirm job details</DialogTitle>
            <DialogContent>
              <JobDetailComponent job={formData} />
              {isLoading && (
                <Box sx={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CircularProgress />
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmCreateOpen(false)} color="primary">
                Cancel
              </Button>
              <Button color="primary" autoFocus onClick={submitJob} >
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <Button variant="outlined" onClick={navigateBackToJobs}>
            Cancel
          </Button>
        </Box>
      </Box >

      {/* Snackbar to provide user feedback */}
      < Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }
        }
        open={!!feedbackMessage}
        autoHideDuration={6000}
        onClose={() => setFeedbackMessage("")}
      >
        <SnackbarContent message={feedbackMessage} />
      </Snackbar >
    </>
  );
};

const textInputCard = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "800px",
};

const internalCard = {
  borderRadius: "10px",
  padding: "5px",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "800px",
};

export default NewJob;
