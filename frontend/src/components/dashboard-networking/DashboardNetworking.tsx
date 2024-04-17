import { Card, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { useEffect } from "react";
import DashboardNetworkCard from "../dashboard-network-card/DashboardNetworkCard";

export const DashboardNetworking = observer(() => {
  const { userStore } = useStores();
  const { myConnections, isConnectionsLoading } = userStore;

  useEffect(() => {
    userStore.fetchMyConnections();
  }, []);

  useEffect(() => {
    console.log(myConnections);
  }, [myConnections]);

  return (
    <Stack spacing={1.5} p={3}>
      <Typography variant="h6">My connections</Typography>
      <Grid container display="flex" alignItems="flex-start" gap={2}>
        {isConnectionsLoading ? (
          [1, 2, 3, 4].map((value, index) => (
            <Skeleton
              variant="rectangular"
              key={value + index}
              width={250}
              height={200}
            />
          ))
        ) : myConnections?.length > 0 ? (
          myConnections.map((connection, index) => (
            <Card
              variant="outlined"
              key={connection.uid + index}
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: 300, lg: 250 },
              }}
            >
              <DashboardNetworkCard user={connection} />
            </Card>
          ))
        ) : (
          <Typography variant="body1">No connections found.</Typography>
        )}
      </Grid>
    </Stack>
  );
});

export default DashboardNetworking;
