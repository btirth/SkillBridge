import { Avatar, Box, Divider, Drawer, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { navigationItems, settings } from "../../utils/routerConfig";
import { APP_TITLE } from "../../utils/constants";
import { useStores } from "../../stores/RootStore";
import { observer } from "mobx-react";

interface NavigationDrawerProps {
  isDrawerOpen: boolean;
  handleDrawerToggle: () => void;
}

const NavigationDrawer = observer(
  ({ isDrawerOpen, handleDrawerToggle }: NavigationDrawerProps) => {
    const { userStore } = useStores();
    const { firstName, lastName, image } = userStore.userDetails;
    const fullName = `${firstName} ${lastName}`;

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const navigate = useNavigate();

    const handleLogout = () => {
      sessionStorage.clear();
      navigate("/sign-in");
    };

    return (
      <Drawer
        variant="temporary"
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 240,
          },
        }}
      >
        <Box onClick={handleDrawerToggle}>
          <Typography
            variant="h6"
            sx={{ my: 2, px: 2 }}
            onClick={() => navigate("")}
          >
            {APP_TITLE}
          </Typography>
          <Divider />
          <Box sx={{ mt: "20px", display: "flex", flexDirection: "column" }}>
            {navigationItems.map((item, index) =>
              item.isProtected && isLoggedIn !== "true" ? null : (
                <NavLink
                  key={item.path + index}
                  to={item.path}
                  className={({ isActive }) => {
                    return isActive
                      ? "app-nav-drawer-link app-nav-drawer-link--active"
                      : "app-nav-drawer-link";
                  }}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </Box>
          <Divider />
          {isLoggedIn === "true" ? (
            <Box sx={{ mt: "20px", display: "flex", flexDirection: "column" }}>
              <NavLink
                to={"profile"}
                className={({ isActive }) => {
                  return isActive
                    ? "app-nav-drawer-link app-nav-drawer-link--active"
                    : "app-nav-drawer-link";
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={image} alt={fullName} />
                  User profile
                </Box>
              </NavLink>
              {settings.slice(1, -1).map((setting, index) => (
                <NavLink
                  key={setting.path + index}
                  to={setting.path}
                  className={({ isActive }) => {
                    return isActive
                      ? "app-nav-drawer-link app-nav-drawer-link--active"
                      : "app-nav-drawer-link";
                  }}
                >
                  {setting.label}
                </NavLink>
              ))}

              <Typography
                onClick={handleLogout}
                padding="10px 10px"
                ml="5px"
                color="#071541"
                fontWeight={500}
              >
                Logout
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: "20px", display: "flex", flexDirection: "column" }}>
              <NavLink
                to="sign-up"
                className={({ isActive }) => {
                  return isActive
                    ? "app-nav-drawer-link app-nav-drawer-link--active"
                    : "app-nav-drawer-link";
                }}
              >
                Sign Up
              </NavLink>
              <NavLink
                to="sign-in"
                className={({ isActive }) => {
                  return isActive
                    ? "app-nav-drawer-link app-nav-drawer-link--active"
                    : "app-nav-drawer-link";
                }}
              >
                Login
              </NavLink>
            </Box>
          )}
        </Box>
      </Drawer>
    );
  }
);

export default NavigationDrawer;
