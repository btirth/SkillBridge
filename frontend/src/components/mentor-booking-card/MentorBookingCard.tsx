import { Avatar, Box, Button, Typography } from "@mui/material";
import { MentorBooking } from "../../models/BookMentor.model";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const MentorBookingCard = ({ booking }: { booking: MentorBooking }) => {
  const navigate = useNavigate();

  const handleViewDetails = (mentorId: string) => {
    navigate(`/mentorprofile/${mentorId}`);
  };

  const handleRateMentor = (mentorId: string) => {
    navigate(`/ratementor/${mentorId}`);
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      py={3}
      px={5}
      gap={1}
    >
      <Avatar
        alt={booking.mentorName}
        src={booking.mentorImg ?? ""}
        sx={{ width: 100, height: 100 }}
      />
      <Typography variant="h6">{booking.mentorName}</Typography>
      <Typography variant="body1">{`${dayjs(booking.date).format(
        "MM/DD/YYYY"
      )} at ${booking.time}`}</Typography>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={() => handleViewDetails(booking.mentorId)}
      >
        View mentor
      </Button>
      <Button
        color="info"
        variant="contained"
        onClick={() => handleRateMentor(booking.mentorId)}
      >
        Rate mentor
      </Button>
    </Box>
  );
};

export default MentorBookingCard;
