import {
  Typography,
  Box,
  Grid,
  Divider,
  Paper,
  Button,
  Rating,
  CircularProgress,
} from "@mui/material";
import RatingTable from "../../components/RatingTable/RatingTable";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Availability } from "../../models/BookMentor.model";
import PaymentSuccessDialog from "../../components/payment-success-dialog/PaymentSuccessDialog";

type MentorDetails = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  imageUrl: string;
  ratings: string;
  bio: string;
  experience: string;
  pay: string;
  expertise: string;
  availability: Availability[];
};

const DEFAULT_VALUES_FOR_MENTOR_DATA = {
  id: "",
  firstName: "",
  lastName: "",
  gender: "",
  imageUrl: "",
  ratings: "0",
  bio: "",
  experience: "",
  pay: "0",
  expertise: "",
  availability: [],
};

const RateMentor = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [rated, setRated] = useState(false);

  const [averageRating, setAverageRating] = useState<number>(0.0);
  const [mentorData, setMentorData] = useState<MentorDetails>(
    DEFAULT_VALUES_FOR_MENTOR_DATA
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/mentor/${id}`
        );
        const mentorDetails = {
          ...response.data,
          availability: JSON.parse(response.data.availability),
        };
        setMentorData(mentorDetails);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to Fetch the Mentor");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMentor();
    }
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{`Error: ${error}`}</Typography>;
  }

  // Handle setting the average rating
  const handleAverageRating = (average: number) => {
    setAverageRating(average);
  };

  function roundToNearestHalf(number1: number, number2: number) {
    const average = (number1 + number2) / 2;
    const roundedAverage = Math.round(average * 2) / 2;
    return roundedAverage;
  }

  const handleSubmit = async () => {
    let updatedRating = 0;
    if (parseFloat(mentorData?.ratings) === 0) {
      updatedRating = averageRating;
    } else {
      updatedRating = roundToNearestHalf(
        parseFloat(mentorData?.ratings),
        averageRating
      );
    }

    console.log(updatedRating);

    const ratingData = {
      rating: updatedRating,
    };

    try {
      const response = await axios({
        method: "put",
        url: `${import.meta.env.VITE_BASE_URL}/mentor/${id}`,
        data: ratingData,
      });
      if (response.status === 200) {
        setRated(true);
        setTimeout(() => {
          navigate("/mentors");
        }, 1000);
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <Grid component="main">
      <PaymentSuccessDialog
        open={rated}
        successText="Ratings Given Successfully"
      />
      <Typography variant="h5">Rate a Mentor</Typography>
      <Divider />
      <Box
        sx={{
          marginTop: 2,
        }}
      >
        <Paper
          sx={{
            padding: 2,
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Box>
                <img
                  src={mentorData?.imageUrl}
                  alt="Profile Image"
                  width={"100%"}
                  height={"100%"}
                  style={{ borderRadius: "10px" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={7} md={8}>
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {mentorData.firstName} {mentorData.lastName}
                </Typography>
                <Box marginTop={1}>
                  <Typography variant="h6">
                    Experience : {mentorData.experience} years
                  </Typography>
                </Box>
                <Typography variant="h6">
                  Area of Expertise : {mentorData.expertise}
                </Typography>
              </Box>
              <Box marginTop={1}>
                <Typography variant="body2">{mentorData.bio}</Typography>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={3}
              md={2}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              alignItems={{ xs: "flex-start" }}
            >
              <Box>
                <Rating
                  name="read-only"
                  value={parseFloat(mentorData.ratings)}
                  precision={0.5}
                  readOnly
                  size="large"
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  alignItems: "center",
                  display: "flex",
                  maxWidth: 300,
                  m: "10px auto 0",
                }}
              >
                View Details
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ mt: 2, md: 2 }} />
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RatingTable onAverageRatingCalculated={handleAverageRating} />
          </Box>
          <Button
            size="large"
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Paper>
      </Box>
    </Grid>
  );
};

export default RateMentor;
