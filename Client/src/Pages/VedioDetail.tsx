import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";

import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { Get_Video_ById, getSubscribeOrNotById } from "../graphql/Query";
import { Box, CardActionArea } from "@mui/material";
import type {
  GetLikedVedioQuery,
  LikeVedioMutation,
  QueryQuery,
  SubscribeChannelMutation,
} from "../types/__generated__/graphql";
import {
  Get_Video_Liked_Detail,
  Liked_Vedio_Mutation,
  subscribeChannel_Mutation,
} from "../graphql/Mutation";
import type { Get_BubscribeOrNot_Interface } from "../graphql/client";
import Comment from "./Comment";
import { useContextCurUser } from "../Component/Context/authContext";
import { socket } from "../socket";

export default function VedioDetail() {
  const { uploadId } = useParams();
  const { authUser } = useContextCurUser();
  const { data, loading, error } = useQuery<QueryQuery>(Get_Video_ById, {
    variables: {
      videoId: Number(uploadId),
    },
  });

  const [handlelikeDislikeMutation] =
    useMutation<LikeVedioMutation>(Liked_Vedio_Mutation);
  const [isLiked, setIsLiked] = React.useState<Boolean | null>(null);
  const [isSubscribe, setIsSubscribe] = React.useState<Boolean | null>(null);

  const { data: getUserLikedDetail } = useQuery<GetLikedVedioQuery>(
    Get_Video_Liked_Detail,
    {
      variables: {
        videoId: Number(uploadId),
      },
    },
  );

  const [subscribeChannel] = useMutation<SubscribeChannelMutation>(
    subscribeChannel_Mutation,
  );

  const { data: getSubscribeOrNot } = useQuery<Get_BubscribeOrNot_Interface>(
    getSubscribeOrNotById,
    {
      variables: {
        getSubscribeChannelId2: data?.getVideoById?.creatorId!,
      },
    },
  );

  console.log("getSubscribeOrNot : ", getSubscribeOrNot);

  React.useEffect(() => {
    setIsLiked(getUserLikedDetail?.getUserVideo?.liked ?? null);
  }, [getUserLikedDetail]);

  React.useEffect(() => {
    setIsSubscribe(getSubscribeOrNot?.getSubscribe?.subscribe ?? null);
  }, [subscribeChannel]);

  React.useEffect(() => {
    console.log("curUserdata is : ");
    if (authUser) {
      const roomId = [authUser?.id, data?.getVideoById?.creatorId]
        .sort()
        .join("-");
      console.log("room id:", roomId);
      socket.emit("joinRoom", roomId);
    }
  }, []);

  // React.useEffect(() => {
  //   if (authUser?.id) {
  //     socket.emit("joinRoom", String(authUser.id));
  //   }
  // }, [authUser?.id]);

  const handleLikeBtn = async (id: number, liked: boolean) => {
    const res = await handlelikeDislikeMutation({
      variables: {
        videoId: id,
        liked: liked,
      },
    });
    const response = res.data?.likeVideo?.liked;
    console.log("response is : ", response);
    setIsLiked(response ?? null);
  };

  const handleSubscribeBtn = async (channelId: number, subscribed: boolean) => {
    const res = await subscribeChannel({
      variables: {
        channelId: channelId,
        subscribe: subscribed,
      },
    });
    const response = res.data?.subscribe;
    console.log("response is : ", response?.subscribe);
    setIsSubscribe(response?.subscribe ?? null);
  };

  if (loading) return <Typography>Loading...</Typography>;
  console.log(data);

  if (error) return <Typography>{error.message}</Typography>;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          placeItems: "center",
          marginTop: "20px",
        }}
      >
        {data ? (
          <>
            <Card sx={{ maxWidth: "90%", height: "100%" }}>
              <CardActionArea>
                <CardMedia
                  component="video"
                  controls
                  src={data.getVideoById?.upload_url}
                  sx={{ height: 500, width: "100%" }}
                />
                <Box>
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", fontSize: "18px" }}
                    >
                      {data?.getVideoById?.title}
                    </Typography>
                  </CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <CardActions disableSpacing>
                      {isSubscribe === null ? (
                        <IconButton
                          aria-label="add to favorites"
                          sx={{ borderRadius: "10px" }}
                          onClick={() => {
                            handleSubscribeBtn(
                              data?.getVideoById?.creatorId!,
                              true,
                            );
                          }}
                        >
                          Subscribe
                        </IconButton>
                      ) : isSubscribe ? (
                        <IconButton
                          aria-label="add to favorites"
                          sx={{ borderRadius: "10px" }}
                          onClick={() => {
                            handleSubscribeBtn(
                              data?.getVideoById?.creatorId!,
                              false,
                            );
                          }}
                        >
                          <NotificationsIcon />
                          UnSubscribe
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            aria-label="add to favorites"
                            sx={{ borderRadius: "10px" }}
                            onClick={() => {
                              handleSubscribeBtn(
                                data?.getVideoById?.creatorId!,
                                true,
                              );
                            }}
                          >
                            <NotificationsActiveIcon /> Subscribe
                          </IconButton>
                        </>
                      )}
                    </CardActions>
                    <CardActions disableSpacing>
                      <IconButton
                        aria-label="add to favorites"
                        onClick={() => {
                          handleLikeBtn(data?.getVideoById?.id!, true);
                        }}
                      >
                        {isLiked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                      </IconButton>
                      <IconButton
                        aria-label="share"
                        onClick={() => {
                          handleLikeBtn(data?.getVideoById?.id!, false);
                        }}
                      >
                        {isLiked ? (
                          <ThumbDownOffAltIcon />
                        ) : isLiked === null ? (
                          <ThumbDownOffAltIcon />
                        ) : (
                          <ThumbDownAltIcon />
                        )}
                      </IconButton>
                    </CardActions>
                  </Box>
                </Box>
              </CardActionArea>
            </Card> 
          </>
        ) : (
          <>
            <Typography>Data not Found</Typography>
          </>
        )}
      </Box>
      <Comment videoId={Number(uploadId)} />
    </>
  );
}
