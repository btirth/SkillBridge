import { Container, Toolbar } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import "./App.scss";
import { Outlet } from "react-router-dom";
import Navigation from "./components/navigation/Navigation";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navigation />
      <Container component="main" sx={{ paddingY: 3 }}>
        <Toolbar sx={{ background: "transparent" }} />
        <Outlet />
        <Footer />
      </Container>
    </Box>
  );
}

export default App;
