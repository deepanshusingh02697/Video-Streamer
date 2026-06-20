import * as React from "react";
import { useQuery } from "@apollo/client/react";
import type { GetNotificationsQuery } from "../../types/__generated__/graphql";
import { getNotifications } from "../../graphql/Query";
import { socket } from "../../socket";
import { Box, Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useContextCurUser } from "../Context/authContext";

interface NotificationItem {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    firstname: string;
    lastname: string;
  };
}

export default function Notiftication() {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const { data, loading, refetch } =
    useQuery<GetNotificationsQuery>(getNotifications);

  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    [],
  );
  const {authUser}=useContextCurUser()

  React.useEffect(() => {
    if (data?.getNotifications) {
      setNotifications(data.getNotifications);
    }
  }, [data]);

  const handleNotificationRefetch = React.useCallback(() => {
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    if (authUser?.id) {
      console.log('joining room with id : ',String(authUser?.id),typeof String(authUser?.id));
      socket.emit("joinRoom", String(authUser?.id));
    }
  }, [authUser?.id]);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("socket connected : ", socket.id);
    });

    socket.on("newNotification", (newNotification: NotificationItem) => {
      console.log("received new notification : ", newNotification);
      handleNotificationRefetch();
    });

    return () => {
      socket.off("connect");
      socket.off("newNotification");
    };
  }, [handleNotificationRefetch]);

  if (loading) return <div>Loading notifications...</div>;

  return (
    <IconButton
      aria-label="show 1 critical alert"
      color="inherit"
      sx={{ position: "relative" }}
    >
      <Badge
        badgeContent={data?.getNotifications.length}
        color="error"
        onClick={() => setIsNotifOpen(!isNotifOpen)}
      >
        <NotificationsIcon />
        {isNotifOpen && (
          <>
            <Box
              sx={{
                position: "absolute",
                top: "45px",
                padding: "5px 7px",
                borderRadius: "10px",
                right: "0px",
                zIndex: "100",
                background: "#E6E6E6",
              }}
            >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    placeItems: "center",
                    fontSize: "16px",
                    minWidth: "300px",
                    gap:"5px"
                  }}
                >
                  {notifications.length === 0 ? (
                    <Box>No notifications yet</Box>
                  ) : (
                    notifications.map((noti) => (
                      <Box
                        key={noti.id}
                        sx={{
                          padding: "5px",
                          borderRadius: "10px",
                          width: "100%",
                          borderBottom: "1px solid #ddd",
                          backgroundColor: noti.isRead ? "white" : "#f0f7ff",
                        }}
                      >
                        <Box>{noti.message}</Box>
                        <Box>
                          {new Date(Number(noti.createdAt)).toLocaleTimeString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
          </>
        )}
      </Badge>
    </IconButton>
  );
}
