import { Card, Skeleton, Stack, Typography } from "@mui/material";
import { observer } from "mobx-react";
import { useStores } from "../../stores/RootStore";
import { formatDate } from "../../utils/helpers";
import dayjs from "dayjs";
import { useEffect } from "react";

const DashboardNews = observer(() => {
  const { dashboardStore } = useStores();
  const { news } = dashboardStore;

  useEffect(() => {
    dashboardStore.getDashboardNews();
  }, []);

  return (
    <Stack spacing={1.5} p={3}>
      <Typography variant="h6">News</Typography>
      {news.isLoading ? (
        [1, 2].map((val, index) => {
          return (
            <Skeleton
              key={"job-" + val + index}
              variant="rectangular"
              height={100}
            />
          );
        })
      ) : news.data?.length > 0 ? (
        <>
          {news.data.slice(0, 4).map((newsItem, index) => {
            return (
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                }}
                key={newsItem.title + index}
              >
                <Typography variant="body2">
                  {formatDate(dayjs(newsItem.pubDate))}
                </Typography>
                <Typography variant="subtitle1" fontWeight={500} mt={0.5}>
                  {newsItem.title}
                </Typography>

                <Typography
                  variant="subtitle2"
                  onClick={() => window.open(newsItem.link, "_blank")}
                  color="#557cf6"
                  sx={{ cursor: "pointer" }}
                  mt={2}
                >
                  Open link
                </Typography>
              </Card>
            );
          })}
        </>
      ) : (
        <Typography variant="body1">No news feed available!</Typography>
      )}
    </Stack>
  );
});

export default DashboardNews;
