import { Box, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";

const BookingDetails = observer(() => {
  const { bookingStore } = useStores();
  const { bookMentor } = bookingStore;
  const { mentorDetails } = bookMentor;

  return (
    <>
      <Typography variant="h6">Book mentor</Typography>
      <MentorDetailsCustomText label="Mentor name" value={mentorDetails.name} />
      <MentorDetailsCustomText
        label="Hourly rate"
        value={`$${mentorDetails.hourlyRate}`}
      />
      <Box display="flex" alignItems={"flex-start"} flexDirection={"column"}>
        <Typography variant="body2">Availability: </Typography>
        {mentorDetails.availability.map((item, index) => {
          return (
            <Typography key={item.day + index} variant="body1" fontWeight={500}>
              {item.day} - {item.startTime} to {item.endTime}
            </Typography>
          );
        })}
      </Box>
      <MentorDetailsCustomText
        label="Bio"
        value={mentorDetails.bio}
        direction="column"
        alignItems="flex-start"
        gap={0}
      />
    </>
  );
});

const MentorDetailsCustomText = ({
  label,
  value,
  direction,
  alignItems,
  gap,
}: {
  label: string;
  value: string;
  direction?: "column" | "row";
  alignItems?: "flex-start" | "center";
  gap?: number;
}) => (
  <Box
    display="flex"
    alignItems={alignItems ?? "center"}
    gap={gap ?? 1}
    flexDirection={direction ?? "row"}
  >
    <Typography variant="body2">{label}: </Typography>
    <Typography variant="body1" fontWeight={500}>
      {value}
    </Typography>
  </Box>
);

export default BookingDetails;
