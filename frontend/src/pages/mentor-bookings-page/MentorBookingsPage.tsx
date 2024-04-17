import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { useEffect } from "react";
import MentorBookingCard from "../../components/mentor-booking-card/MentorBookingCard";

const MentorBookingsPage = observer(() => {
  const { bookingStore } = useStores();
  const { mentorBookings, isBookingsLoading } = bookingStore;

  useEffect(() => {
    bookingStore.fetchMentorBookings();
  }, []);

  return (
    <Grid container display="flex" alignItems="flex-start" gap={2}>
      <Box width={"100%"} mb={1}>
        <Typography variant="h5">Mentor bookings</Typography>
      </Box>
      {isBookingsLoading ? (
        [1, 2, 3].map((value, index) => (
          <Skeleton
            key={value + index}
            width={250}
            height={300}
            variant="rectangular"
          />
        ))
      ) : mentorBookings.length > 0 ? (
        mentorBookings.map((booking, index) => (
          <Paper
            elevation={2}
            key={booking.id + index}
            sx={{ width: "100%", maxWidth: { xs: "100%", sm: 300, lg: 250 } }}
          >
            <MentorBookingCard booking={booking} />
          </Paper>
        ))
      ) : (
        <Typography variant="body1">No bookings found.</Typography>
      )}
    </Grid>
  );
});

export default MentorBookingsPage;
