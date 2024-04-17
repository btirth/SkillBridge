import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useStores } from "../../stores/RootStore";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { Dayjs } from "dayjs";
import { generateTimeSlots, getDayNumber } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import { useState } from "react";
import ConfirmDialog from "../confirm-dialog/ConfirmDialog";

const BookingDateTime = observer(() => {
  const { bookingStore, paymentsStore } = useStores();
  const { bookMentor } = bookingStore;
  const { bookingDetails, mentorDetails } = bookMentor;
  const { availability } = mentorDetails;
  const timeSlots = generateTimeSlots(
    bookingDetails.date ?? null,
    availability
  );

  const [showTimeError, setShowTimeError] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const navigate = useNavigate();

  const handleDateChange = (date: Dayjs | null) => {
    bookingStore.updateBookingDetails({ date, time: "" });
    setShowTimeError(false);
  };

  const handleDisableDate = (date: Dayjs) => {
    const day = date.day();
    const available = availability.find(
      (item) => day === getDayNumber(item.day)
    );
    if (available) return false;
    return true;
  };

  const handleTimeChange = (event: SelectChangeEvent) => {
    bookingStore.updateBookingDetails({ time: event.target.value as string });
  };

  const handleBookClick = () => {
    setShowConfirmationDialog(true);
  };

  const handleBook = () => {
    paymentsStore.updatePaymentDetails({
      amount: mentorDetails.hourlyRate,
      description: `Mentor name:${mentorDetails.name} ${mentorDetails.bio}`,
      type: "BOOK_MENTOR",
      referenceId: mentorDetails.id,
      name: "Book mentor",
      paymentInfo: `Booking date: ${bookingDetails.date?.format(
        "MM/DD/YYYY"
      )} ${bookingDetails.time}`,
    });
    paymentsStore.updatePayment({
      amount: +(mentorDetails.hourlyRate * 1.15).toFixed(2),
    });
    setShowConfirmationDialog(false);
    navigate("/pay", {
      state: { prevUrl: location.pathname, redirectUrl: "/bookings" },
    });
  };

  const handleTimeSelectClick = () => {
    if (!bookingDetails.date) {
      setShowTimeError(true);
    } else {
      setShowTimeError(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ pt: 2, pb: 4, px: { xs: 0, md: 3 } }}>
      <ConfirmDialog
        open={showConfirmationDialog}
        message={`Proceed with booking for ${bookingDetails.date?.format(
          "MM/DD/YYYY"
        )} at ${bookingDetails.time}(1 hour)`}
        onSubmit={handleBook}
        onCancel={() => setShowConfirmationDialog(false)}
      />
      <Typography px={{ xs: 3, sm: 3 }} variant="h6">
        Select date
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={bookingDetails.date}
          onChange={handleDateChange}
          disablePast
          disableHighlightToday
          renderLoading={() => <DayCalendarSkeleton />}
          shouldDisableDate={handleDisableDate}
          showDaysOutsideCurrentMonth
        />
      </LocalizationProvider>
      <Box px={3}>
        <Typography variant="h6" mb={2}>
          Select time
        </Typography>
        <FormControl fullWidth sx={{ maxWidth: "200px" }}>
          <InputLabel id="time-select-label">Time</InputLabel>
          <Select
            labelId="time-select-label"
            id="time-select"
            value={bookingDetails.time}
            label="Time"
            onChange={handleTimeChange}
            disabled={!bookingDetails.date}
            onClick={handleTimeSelectClick}
          >
            {timeSlots.map((slot, index) => {
              return (
                <MenuItem value={slot} key={slot + index}>
                  {slot}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {showTimeError ? (
          <Typography variant="body2" color="red">
            Please select a date
          </Typography>
        ) : null}
      </Box>
      {bookingDetails.date || bookingDetails.time ? (
        <Box px={3} mt={3}>
          <Typography variant="h6" mb={1}>
            Booking details
          </Typography>
          {bookingDetails.date ? (
            <Box mb={1} display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">Booking date:</Typography>
              <Typography variant="body1" fontWeight={500}>
                {bookingDetails.date?.format("MM/DD/YYYY")}
              </Typography>
            </Box>
          ) : null}

          {bookingDetails.time ? (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">Booking time:</Typography>
              <Typography variant="body1" fontWeight={500}>
                {bookingDetails.time} (1 hour)
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : null}
      <LoadingButton
        fullWidth
        loading={false}
        disabled={!(bookingDetails.date && bookingDetails.time)}
        variant="contained"
        sx={{ maxWidth: "250px", margin: "30px auto 0", display: "flex" }}
        type="button"
        onClick={handleBookClick}
      >
        Book now
      </LoadingButton>
    </Paper>
  );
});

export default BookingDateTime;
