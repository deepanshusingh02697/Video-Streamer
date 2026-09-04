import * as React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { GetNotificationsQuery } from "../../types/__generated__/graphql";
import { getNotifications } from "../../graphql/Query";
import { socket } from "../../socket";
import { Box, Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useContextCurUser } from "../Context/authContext";
import { updateReadNotification_Mutation } from "../../graphql/Mutation";

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

  const [updateReadNotif] = useMutation<boolean>(
    updateReadNotification_Mutation,
  );

  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    [],
  );
  const notiRef = React.useRef<HTMLDivElement>(null);
  const { authUser } = useContextCurUser();

  React.useEffect(() => {
    const handleNotifPopup = (event: MouseEvent) => {
      if (notiRef.current && !notiRef.current?.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleNotifPopup);
    return () => document.removeEventListener("mousedown", handleNotifPopup);
  });
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
      console.log(
        "joining room with id : ",
        String(authUser?.id),
        typeof String(authUser?.id),
      );
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

  const handleNotificationRead = async () => {
    if (!isNotifOpen) {
      await updateReadNotif();
      setIsNotifOpen(true);
    } else {
      refetch();
      setIsNotifOpen(false);
    }
  };

  if (loading) return <div>Notifications...</div>;

  return (
    <IconButton
      aria-label="show 1 critical alert"
      color="inherit"
      sx={{ position: "relative" }}
    >
      <Badge
        badgeContent={data?.getNotifications.length}
        color="error"
        onClick={handleNotificationRead}
      >
        <Box ref={notiRef}>
          <NotificationsIcon />
          {isNotifOpen && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: "45px",
                  padding: "5px 7px",
                  borderRadius: "10px",
                  right: "-50px",
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
                    gap: "5px",
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
        </Box>
      </Badge>
    </IconButton>
  );
}
