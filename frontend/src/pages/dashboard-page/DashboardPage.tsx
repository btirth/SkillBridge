import { Grid, Paper } from "@mui/material";
import DashboardJobs from "../../components/dashboard-jobs/DashboardJobs";
import DashboardNews from "../../components/dashboard-news/DashboardNews";
import DashboardMentors from "../../components/dashboard-mentors/DashboardMentors";
import DashboardNetworking from "../../components/dashboard-networking/DashboardNetworking";

const DashboardPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={8}>
        <Paper elevation={2} sx={{ height: "100%" }}>
          <DashboardJobs />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper elevation={2} sx={{ height: "100%" }}>
          <DashboardNews />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Paper elevation={2}>
          <DashboardMentors />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={2}>
          <DashboardNetworking />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
