import { createTheme, responsiveFontSizes } from "@mui/material";

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#071541",
      },
      secondary: {
        main: "#78909c",
      },
      background: {
        default: "#fafafa",
      },
    },
    typography: {
      fontSize: 14,
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
              {
                display: "none",
              },
            "& input[type=number]": {
              MozAppearance: "textfield",
            },
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          root: {
            background: "#fff",
            color: "#071541",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          root: {
            background: "#fff",
          },
        },
      },
    },
  })
);
