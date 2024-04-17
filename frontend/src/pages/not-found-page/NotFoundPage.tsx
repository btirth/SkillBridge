import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box>
      404 Not found
      <NavLink to="/">Home</NavLink>
    </Box>
  );
};

export default NotFoundPage;
