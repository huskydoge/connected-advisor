// src/pages/_app.tsx
import React from "react";
import { AppProps } from "next/app";
import "../styles/globals.css"; // 全局样式
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: "#ff0000",
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: [
      "Roboto", // 主字体
      '"Helvetica Neue"', // 附加字体
      "Arial",
      "sans-serif", // 如果以上字体无法加载，将回退到无衬线字体
    ].join(","),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
