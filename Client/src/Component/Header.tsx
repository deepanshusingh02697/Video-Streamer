import { Box, Button, Toolbar, IconButton, Typography } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { Logout_Mutation } from "../graphql/Mutation";
import { getCurUser_Query } from "../graphql/Query";
import type { CurrUserQuery } from "../types/__generated__/graphql";
import Notiftication from "./Notification/Notiftication";
import { useContextCurUser } from "./Context/authContext";
import Avatar from '@mui/material/Avatar';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const client = useApolloClient();

  const [logOutUser] = useMutation<boolean>(Logout_Mutation);
  const { data } = useQuery<CurrUserQuery>(getCurUser_Query);
  const { authUser } = useContextCurUser();

  const handleLogout = async () => {
    try {
      await logOutUser();
      await client.clearStore();
      navigate("/login");
      toast.success("Logged out successfully", {
        position: "top-right",
        type: "success",
        autoClose: 3000,
      });
    } catch (error: any) {
      console.error("Logout failed : ", error);
      if (error.name === "AbortError" || error.message?.includes("aborted")) {
        console.log("Logout redirect cleanup aborted safely.");
      } else {
        console.error("Logout failed : ", error);
      }
    }
    setIsOpen(false);
  };
  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Toolbar
        sx={{
          display: "grid",
          placeItems: "center",
          borderBottom: "1px solid gray",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ width: "85%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography variant="h6">
              <NavLink to="/">VideoStream</NavLink>
            </Typography>
            <Box sx={{ flex: "flex-end", display: "flex", gap: "10px" }}>
              <Button
                color="inherit"
                sx={{
                  background: "#E6E6E6",
                  borderRadius: "15px",
                  padding: "0px 14px",
                  textTransform: "capitalize",
                  fontSize: "15px",
                }}
              >
                <NavLink to="/upload">+ Create</NavLink>
              </Button>
              <Notiftication />

              <IconButton
                color="inherit"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
              >
                {authUser ? (
                  <Avatar>{authUser.firstname[0].toUpperCase()}</Avatar>
                ) : (
                  <AccountCircleIcon />
                )}
              </IconButton>
            </Box>
          </Box>
          {isOpen && (
            <Box
              sx={{
                position: "absolute",
                right: "8vw",
                padding: "10px 20px",
                top: "65px",
                zIndex: "10",
                backgroundColor: "white",
                boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
              }}
            >
              <Box
                sx={{
                  padding: "1px",
                  display: "flex",
                  gap: "5px",
                  flexDirection: "column",
                }}
              >
                <Button
                  sx={{
                    textTransform: "capitalize",
                    cursor: "pointer",
                  }}
                >
                  <NavLink to="/subscriber">Subscribers</NavLink>
                </Button>
                {data ? (
                  <>
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button sx={{ textTransform: "capitalize" }}>
                      <NavLink to="/login">LogIn</NavLink>
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Stack>
      </Toolbar>
    </>
  );
};

export default Header;
