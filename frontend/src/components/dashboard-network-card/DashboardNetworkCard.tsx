import { Avatar, Box, Button, Typography } from "@mui/material";
import { UserDetails } from "../../models/UserDetatils.model";
import { useNavigate } from "react-router-dom";

const DashboardNetworkCard = ({ user }: { user: UserDetails }) => {
  const fullName = `${user.firstName} ${user.lastName}`;
  const navigate = useNavigate();

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
        alt={fullName}
        src={user.image ?? ""}
        sx={{ width: 100, height: 100 }}
      />
      <Typography variant="h6">{fullName}</Typography>
      <Button
        sx={{ mt: 3 }}
        variant="outlined"
        onClick={() =>
          navigate("/messages", { state: { receiverId: user.uid } })
        }
      >
        Message
      </Button>
    </Box>
  );
};

export default DashboardNetworkCard;
