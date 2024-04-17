/**
 * @author Drashti Navadiya (B00948838)
 */
import * as React from "react";
import {
  Container,
  Typography,
  Grid,
  Stack,
  Chip,
  Card,
  Link,
  Box,
  Button,
  CssBaseline,
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DevicesRoundedIcon from "@mui/icons-material/DevicesRounded";
import EdgesensorHighRoundedIcon from "@mui/icons-material/EdgesensorHighRounded";
import ViewQuiltRoundedIcon from "@mui/icons-material/ViewQuiltRounded";
import dashboardImage from "../../assets/dashboard.png";
import communityImage from "../../assets/community.png";
import learningImage from "../../assets/learning.png";
export default function LandingPage() {
  const decorative = "All-in-One";
  const title1 = "Connecting Minds, Empowering Futures";
  const subtitle1 =
    "Unlock endless possibilities with SkillBridge, the ultimate platform for networking and learning. Join a vibrant community of like-minded individuals, where connections flourish, and knowledge thrives.";
  const title2 = "Explore, Learn, Connect!";
  const subtitle2 =
    "Ready to take your career to new heights? Join to embark on a journey of learning and networking.";
  const items = [
    {
      icon: <ViewQuiltRoundedIcon />,
      title: "Dashboard",
      description:
        "Effortlessly maximize productivity and elevate your user experience with our intuitive User Dashboard, providing easy access to resources, curated content, and essential tools, all conveniently located in one place for seamless organization and enhanced efficiency.",
      imageLight: dashboardImage,

      imageDark: dashboardImage,
    },
    {
      icon: <EdgesensorHighRoundedIcon />,
      title: "Community Engagement",
      description:
        "Build meaningful connections with professionals who share your interests, passions, and career goals. Our community is diverse, bringing together individuals from various industries and backgrounds.",
      imageLight: communityImage,
      imageDark: communityImage,
    },
    {
      icon: <DevicesRoundedIcon />,
      title: "Professional Learning",
      description:
        "Stay informed about upcoming webinars and live sessions. Interact with industry experts in real-time and enhance your knowledge. Celebrate your achievements and milestones. Earn badges and certificates to showcase your skills to your professional network.",
      imageLight: learningImage,
      imageDark: learningImage,
    },
  ];
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];
  return (
    <Container component="main" maxWidth="lg">
      <Container component="section" maxWidth="lg">
        <CssBaseline />
        <Box sx={{ bgcolor: "background.default" }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: 2,
              mt: 6,
              mb: 1,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                color: "primary.500",
                fontWeight: 600,
                fontSize: "sm",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {decorative}
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "4xl", sm: "5xl", md: "6xl" },
                fontWeight: 800,
              }}
            >
              {title1}
            </Typography>
            <Typography
              sx={{
                fontSize: "lg",
                color: "gray.500",
                maxWidth: "70ch",
              }}
            >
              {subtitle1}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "4xl", sm: "5xl", md: "6xl" },
                fontWeight: 800,
              }}
            >
              {title2}
            </Typography>
            <Typography
              sx={{
                fontSize: "lg",
                color: "gray.500",
                maxWidth: "54ch",
              }}
            >
              {subtitle2}
            </Typography>
            <Button
              color="primary"
              type="button"
              variant="contained"
              href="/sign-up"
              sx={{ mt: 1, mb: 2 }}
            >
              Join Us
            </Button>

            <Typography
              sx={{
                fontSize: "lg",
                color: "gray.500",
                maxWidth: "54ch",
              }}
            >
              Already have an account?
            </Typography>
            <Button
              color="primary"
              type="button"
              variant="contained"
              href="/sign-in"
              sx={{ mt: 1, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Container>
      <Container
        id="features"
        sx={{ pt: { xs: 2, sm: 6 }, pb: { xs: 8, sm: 16 } }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <div>
              <Typography component="h2" variant="h4" color="text.primary">
                Features
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: { xs: 2, sm: 4 } }}
              >
                Here you can provide a brief overview of the key features of the
                product. For example, you could list the number of features, the
                types of features, add-ons, or the benefits of the features.
              </Typography>
            </div>
            <Grid
              container
              item
              gap={1}
              sx={{ display: { xs: "auto", sm: "none" } }}
            >
              {items.map(({ title }, index) => (
                <Chip
                  key={index}
                  label={title}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    borderColor: (theme) => {
                      if (theme.palette.mode === "light") {
                        return selectedItemIndex === index
                          ? "primary.light"
                          : "";
                      }
                      return selectedItemIndex === index ? "primary.light" : "";
                    },
                    background: (theme) => {
                      if (theme.palette.mode === "light") {
                        return selectedItemIndex === index ? "none" : "";
                      }
                      return selectedItemIndex === index ? "none" : "";
                    },
                    backgroundColor:
                      selectedItemIndex === index ? "primary.main" : "",
                    "& .MuiChip-label": {
                      color: selectedItemIndex === index ? "#fff" : "",
                    },
                  }}
                />
              ))}
            </Grid>
            <Box
              component={Card}
              variant="outlined"
              sx={{
                display: { xs: "auto", sm: "none" },
                mt: 4,
              }}
            >
              <Box
                sx={{
                  backgroundImage: (theme) =>
                    theme.palette.mode === "light"
                      ? `url(${selectedFeature.imageLight})`
                      : `url(${selectedFeature.imageDark})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: 280,
                }}
              />
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography
                  color="text.primary"
                  variant="body2"
                  fontWeight="bold"
                >
                  {selectedFeature.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ my: 0.5 }}
                >
                  {selectedFeature.description}
                </Typography>
                <Link
                  color="primary"
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    "& > svg": { transition: "0.2s" },
                    "&:hover > svg": { transform: "translateX(2px)" },
                  }}
                >
                  <span>Learn more</span>
                  <ChevronRightRoundedIcon
                    fontSize="small"
                    sx={{ mt: "1px", ml: "2px" }}
                  />
                </Link>
              </Box>
            </Box>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="flex-start"
              spacing={2}
              useFlexGap
              sx={{ width: "100%", display: { xs: "none", sm: "flex" } }}
            >
              {items.map(({ icon, title, description }, index) => (
                <Card
                  key={index}
                  component={Button}
                  onClick={() => handleItemClick(index)}
                  sx={{
                    p: 3,
                    height: "fit-content",
                    width: "100%",
                    background: "none",
                    backgroundColor:
                      selectedItemIndex === index
                        ? "action.selected"
                        : undefined,
                    borderColor: (theme) => {
                      if (theme.palette.mode === "light") {
                        return selectedItemIndex === index
                          ? "primary.light"
                          : "grey.200";
                      }
                      return selectedItemIndex === index
                        ? "primary.dark"
                        : "grey.800";
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      textAlign: "left",
                      flexDirection: { xs: "column", md: "row" },
                      alignItems: { md: "center" },
                      gap: 2.5,
                      textTransform: "none",
                    }}
                  >
                    <Box
                      sx={{
                        color: (theme) => {
                          if (theme.palette.mode === "light") {
                            return selectedItemIndex === index
                              ? "primary.main"
                              : "grey.300";
                          }
                          return selectedItemIndex === index
                            ? "primary.main"
                            : "grey.700";
                        },
                      }}
                    >
                      {icon}
                    </Box>
                    <div>
                      <Typography
                        color="text.primary"
                        variant="body2"
                        fontWeight="bold"
                      >
                        {title}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ my: 0.5 }}
                      >
                        {description}
                      </Typography>
                      <Link
                        color="primary"
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          "& > svg": { transition: "0.2s" },
                          "&:hover > svg": { transform: "translateX(2px)" },
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                        }}
                      >
                        <span>Learn more</span>
                        <ChevronRightRoundedIcon
                          fontSize="small"
                          sx={{ mt: "1px", ml: "2px" }}
                        />
                      </Link>
                    </div>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: "none", sm: "flex" }, width: "100%" }}
          >
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                width: "100%",
                display: { xs: "none", sm: "flex" },
                pointerEvents: "none",
                backgroundSize: "cover",
                backgroundImage: (theme) =>
                  theme.palette.mode === "light"
                    ? `url(${selectedFeature.imageLight})`
                    : `url(${selectedFeature.imageDark})`,
              }}
            >
              <Box
                sx={{
                  m: "auto",
                  width: 420,
                  height: 500,
                }}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}
