import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Container, Grid } from "@mui/material";
import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingDateTime from "../../components/booking-date-time/BookingDateTime";
import BookingDetails from "../../components/booking-details/BookingDetails";
import { useStores } from "../../stores/RootStore";

const BookMentorPage = observer(() => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingStore } = useStores();

  const handleBack = () => {
    navigate(
      location.state?.prevUrl ??
        `/mentorprofile/${bookingStore.bookMentor.mentorDetails.id}`
    );
    bookingStore.resetBookMentor();
  };

  return (
    <Container sx={{ pb: "30px" }}>
      <Box pt={3}>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Go back
        </Button>
      </Box>
      <Grid
        container
        pt={{ xs: 2 }}
        px={{ sm: 1 }}
        gap={{ xs: 3, sm: 0 }}
        alignItems={{ xs: "center", sm: "flex-start" }}
        justifyContent={{ xs: "center", sm: "space-between" }}
        sx={{ width: "100%", margin: "0 auto" }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={7}
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="space-between"
          gap={2}
        >
          <BookingDetails />
        </Grid>
        <BookingDateTime />
      </Grid>
    </Container>
  );
});

export default BookMentorPage;
