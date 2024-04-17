import { Button, Card, Skeleton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useStores } from "../../stores/RootStore";
import dayjs from "dayjs";
import { formatDate } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

const DashboardJobs = observer(() => {
  const { dashboardStore } = useStores();
  const { jobs } = dashboardStore;
  const navigate = useNavigate();

  useEffect(() => {
    dashboardStore.getDashboardJobs();
  }, []);

  return (
    <Stack p={3} spacing={1.5}>
      <Typography variant="h6">Jobs</Typography>
      {jobs.isLoading ? (
        [1, 2].map((val, index) => {
          return (
            <Skeleton
              key={"job-" + val + index}
              variant="rectangular"
              height={100}
            />
          );
        })
      ) : jobs.data?.length > 0 ? (
        <>
          {jobs.data.slice(0, 2).map((job, index) => {
            return (
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  cursor: "pointer",
                  ":hover": { backgroundColor: "#e2e2e2" },
                }}
                key={job.title + index}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <Typography variant="subtitle1" fontWeight={500}>
                  {job.title}
                </Typography>
                <Typography variant="body1">{job.description}</Typography>
                <Typography variant="body1" fontWeight={500} mt={2}>
                  Posted: {formatDate(dayjs(job.createDate), "MMM DD, YYYY")}
                </Typography>
              </Card>
            );
          })}
          {jobs.data.length > 2 ? (
            <Button onClick={() => navigate("/jobs")}>View more</Button>
          ) : null}
        </>
      ) : (
        <Typography variant="body1">No jobs available currently!</Typography>
      )}
    </Stack>
  );
});

export default DashboardJobs;
