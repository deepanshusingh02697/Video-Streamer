import {
  Box,
  Button,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  useMediaQuery,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApolloClient, useMutation, useQuery } from "@apollo/client/react";
import { toast } from "react-toastify";
import { Logout_Mutation } from "../graphql/Mutation";
import { getCurUser_Query } from "../graphql/Query";
import type { CurrUserQuery } from "../types/__generated__/graphql";
import Notiftication from "./Notification/Notiftication";
import Avatar from "@mui/material/Avatar";
import { useSearchVideo } from "./Context/searchVideo";
import ClearIcon from "@mui/icons-material/Clear";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const client = useApolloClient();
  const isMobile = useMediaQuery("(max-width:768px)");
  const { setSearchValuebyHook } = useSearchVideo();
  const profileRef = useRef<HTMLDivElement>(null);

  const [logOutUser] = useMutation<boolean>(Logout_Mutation, {
    refetchQueries: [
      {
        query: getCurUser_Query,
      },
    ],
  });
  const { data, refetch } = useQuery<CurrUserQuery | undefined>(
    getCurUser_Query,
  );
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logOutUser();
      // await client.clearStore();
      await client.resetStore(); //give active querie data
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
    setSearchValuebyHook(searchValue);
  };

  useEffect(() => {
    setIsOpen(false);
  }, []);
  useEffect(() => {
    refetch();
  }, [logOutUser, data]);

  const ClearSearchInput = () => {
    setSearchValue("");
    setSearchValuebyHook("");
    setMobileSearchOpen(false);
  };
  if (isMobile && mobileSearchOpen) {
    return (
      <Toolbar sx={{ borderBottom: "1px solid #e0e0e0", gap: "10px" }}>
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "20px",
            padding: "2px 8px 2px 16px",
          }}
        >
          <InputBase
            autoFocus
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ flex: 1, fontSize: "15px" }}
          />
          <IconButton type="submit" size="small">
            <SearchIcon />
          </IconButton>
        </Box>
        <IconButton onClick={ClearSearchInput}>
          <CloseIcon />
        </IconButton>
      </Toolbar>
    );
  }

  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
          gap: "12px",
          padding: { xs: "0 12px", sm: "0 35px" },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            flexShrink: 0,
            "& a": { textDecoration: "none", color: "inherit" },
          }}
          onClick={() => setSearchValuebyHook("")}
        >
          <NavLink to="/">VideoStream</NavLink>
        </Typography>

        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              maxWidth: "600px",
              mx: "auto",
              border: "1px solid #ccc",
              borderRadius: "20px",
              padding: "2px 8px 2px 16px",
              "&:focus-within": {
                borderColor: "gray",
              },
            }}
          >
            <InputBase
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "15px",
              }}
            />
            {searchValue && (
              <>
                <IconButton size="small" onClick={ClearSearchInput}>
                  <ClearIcon />
                </IconButton>
              </>
            )}
            <IconButton type="submit" size="small">
              <SearchIcon
                sx={{ borderLeft: "1px solid gray", width: "30px" }}
              />
            </IconButton>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: "4px", sm: "10px" },
            flexShrink: 0,
          }}
        >
          {isMobile && (
            <IconButton onClick={() => setMobileSearchOpen(true)}>
              <SearchIcon />
            </IconButton>
          )}

          {isMobile ? (
            <IconButton color="inherit" onClick={() => navigate("/upload")}>
              <AddIcon />
            </IconButton>
          ) : (
            <Button
              color="inherit"
              sx={{
                background: "#E6E6E6",
                borderRadius: "15px",
                padding: "0px 14px",
                textTransform: "capitalize",
                fontSize: "15px",
                whiteSpace: "nowrap",
              }}
            >
              <NavLink
                to="/upload"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  textAlign: "center",
                  padding: "4px 0px",
                  fontSize: "16px",
                }}
              >
                + Create
              </NavLink>
            </Button>
          )}

          <Notiftication />

          <Box ref={profileRef} sx={{ position: "relative" }}>
            <IconButton
              color="inherit"
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            >
              {data !== undefined ? (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: "14px",
                    background: "#00887B",
                  }}
                >
                  {data?.currentUser.firstname[0].toUpperCase()}
                </Avatar>
              ) : (
                <AccountCircleIcon />
              )}
            </IconButton>
            {isOpen && (
              <Box
                sx={{
                  position: "absolute",
                  right: { xs: "12px", sm: "20px" },
                  padding: "4px 12px",
                  top: "63px",
                  zIndex: 10,
                  backgroundColor: "white",
                  boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                  borderRadius: "8px",
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
                  <Button sx={{ textTransform: "capitalize" }}>
                    <NavLink
                      to="/subscriber"
                      style={{ textDecoration: "none", color: "inherit" }}
                      onClick={() => setIsOpen(false)}
                    >
                      Subscribers
                    </NavLink>
                  </Button>
                  {data ? (
                    <Button
                      sx={{ textTransform: "capitalize" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button sx={{ textTransform: "capitalize" }}>
                      <NavLink
                        to="/login"
                        style={{ textDecoration: "none", color: "inherit" }}
                        onClick={() => setIsOpen(false)}
                      >
                        LogIn
                      </NavLink>
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>
    </>
  );
};

export default Header;
