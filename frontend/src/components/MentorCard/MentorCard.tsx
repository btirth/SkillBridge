// MentorCard.tsx
import React from "react";
import { Typography, Button, Box, Grid, Paper, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";

type MentorCardProps = {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  ratings: string;
  bio: string;
  experience: string;
  pay: string;
  expertise: string;
};

const MentorCard: React.FC<MentorCardProps> = ({
  id,
  firstName,
  lastName,
  experience,
  expertise,
  ratings,
  bio,
  pay,
  imageUrl,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/mentorprofile/${id}`);
  };

  return (
    <Paper
      sx={{
        padding: 2,
        borderRadius: "10px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2} md={3}>
          <Box>
            <img
              src={imageUrl}
              alt="Profile Image"
              width={"100%"}
              height={"100%"}
              style={{ borderRadius: "10px" }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={7} md={7}>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {firstName} {lastName}
            </Typography>
          </Box>

          <Typography variant="subtitle1">
            Experience : {experience} years
          </Typography>
          <Typography variant="subtitle1">
            Area of Expertise : {expertise}
          </Typography>
          <Box marginTop={2}>
            <Typography variant="body2" component="p">
              {bio}
            </Typography>
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
              value={parseFloat(ratings)}
              precision={0.5}
              readOnly
              size="medium"
            />
            <Typography variant="h6">$ {parseFloat(pay)}/hr</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleViewDetails}
            sx={{
              alignItems: "center",
              display: "flex",
              maxWidth: 300,
              m: "10px auto 0",
              fontSize: 12,
            }}
          >
            View Details
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MentorCard;
