import { Outlet } from "react-router-dom";
import Header from "../Component/Header.tsx";
import { Box } from "@mui/material";

export default function Layout() {
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column",gap:"20px" }}>
        <Header />
        <Outlet />
      </Box>
    </>
  );
}
