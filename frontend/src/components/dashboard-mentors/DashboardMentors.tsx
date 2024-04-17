import { Button, Card, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { useNavigate } from "react-router-dom";
import MentorBookingCard from "../mentor-booking-card/MentorBookingCard";
import { useEffect } from "react";

const DashboardMentors = observer(() => {
  const { bookingStore } = useStores();
  const { mentorBookings, isBookingsLoading } = bookingStore;

  const navigate = useNavigate();

  useEffect(() => {
    bookingStore.fetchMentorBookings();
  }, []);

  return (
    <Stack p={3} display="flex" gap={1}>
      <Typography variant="h6">Mentor Bookings</Typography>
      <Grid container display="flex" alignItems="flex-start" gap={2}>
        {isBookingsLoading ? (
          [1, 2, 3, 4].map((value, index) => (
            <Skeleton
              variant="rectangular"
              key={value + index}
              width={250}
              height={250}
            />
          ))
        ) : mentorBookings.length > 0 ? (
          mentorBookings.slice(0, 4).map((booking, index) => {
            return (
              <Card
                variant="outlined"
                key={booking.mentorId + index}
                sx={{
                  width: "100%",
                  maxWidth: { xs: "100%", sm: 300, lg: 250 },
                }}
              >
                <MentorBookingCard booking={booking} />
              </Card>
            );
          })
        ) : (
          <Typography variant="body1">No bookings found</Typography>
        )}
      </Grid>
      {mentorBookings.length > 2 ? (
        <Button onClick={() => navigate("/bookings")}>View more</Button>
      ) : null}
    </Stack>
  );
});

export default DashboardMentors;
