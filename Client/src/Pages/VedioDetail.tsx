import * as React from "react";
import Card from "@mui/material/Card";
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
import { Box } from "@mui/material";
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
import { MyPlayer } from "../Component/VideoJs/MyPlayer";
import "@fontsource/roboto/500.css";

export default function VedioDetail() {
  const { uploadId } = useParams();
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

  const creatorId = data?.getVideoById?.creatorId;

  const { data: getSubscribeOrNot } = useQuery<Get_BubscribeOrNot_Interface>(
    getSubscribeOrNotById,
    {
      variables: {
        getSubscribeChannelId2: creatorId!,
      },
      skip: !creatorId,
    },
  );

  React.useEffect(() => {
    setIsLiked(getUserLikedDetail?.getUserVideo?.liked ?? null);
  }, [getUserLikedDetail]);

  React.useEffect(() => {
    setIsSubscribe(getSubscribeOrNot?.getSubscribe?.subscribe ?? null);
  }, [getSubscribeOrNot]);

  const handleLikeBtn = async (id: number, liked: boolean) => {
    const res = await handlelikeDislikeMutation({
      variables: {
        videoId: id,
        liked: liked,
      },
    });
    const response = res.data?.likeVideo?.liked;
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
    setIsSubscribe(response?.subscribe ?? null);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>{error.message}</Typography>;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "grid",
          placeItems: "center",
          marginTop: "20px",
          padding: { xs: "0 12px", sm: "0 20px" },
        }}
      >
        {data?.getVideoById ? (
          <Card sx={{ width: { xs: "100%", sm: "90%" }, boxShadow: "none" }}>
            {/* <CardMedia
              component="video"
              controls
              src={data.getVideoById.upload_url}
              sx={{
                width: "100%",
                aspectRatio: "16 / 9",
                height: "auto",
                borderRadius: "12px",
                backgroundColor: "#000",
              }}
            /> */}
            <MyPlayer src={data.getVideoById.upload_url} />

            <CardContent sx={{ px: { xs: 0, sm: 2 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "16px", sm: "18px" },
                  fontWeight: 600,
                  fontFamily: "Roboto",
                }}
              >
                {data.getVideoById.title}
              </Typography>
            </CardContent>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "8px",
                px: { xs: 0, sm: 2 },
              }}
            >
              <CardActions disableSpacing sx={{ p: 0 }}>
                {isSubscribe === null ? (
                  <IconButton
                    aria-label="subscribe"
                    sx={{ borderRadius: "10px", gap: "6px", fontSize: "14px" }}
                    onClick={() => handleSubscribeBtn(creatorId!, true)}
                  >
                    <NotificationsIcon fontSize="small" /> Subscribe
                  </IconButton>
                ) : isSubscribe ? (
                  <IconButton
                    aria-label="unsubscribe"
                    sx={{ borderRadius: "10px", gap: "6px", fontSize: "14px" }}
                    onClick={() => handleSubscribeBtn(creatorId!, false)}
                  >
                    <NotificationsActiveIcon fontSize="small" /> Subscribed
                  </IconButton>
                ) : (
                  <IconButton
                    aria-label="subscribe"
                    sx={{ borderRadius: "10px", gap: "6px", fontSize: "14px" }}
                    onClick={() => handleSubscribeBtn(creatorId!, true)}
                  >
                    <NotificationsIcon fontSize="small" /> Subscribe
                  </IconButton>
                )}
              </CardActions>

              <CardActions disableSpacing sx={{ p: 0 }}>
                <IconButton
                  aria-label="like"
                  onClick={() => handleLikeBtn(data.getVideoById!.id!, true)}
                >
                  {isLiked === true ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
                </IconButton>
                <IconButton
                  aria-label="dislike"
                  onClick={() => handleLikeBtn(data.getVideoById!.id!, false)}
                >
                  {isLiked === false ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownOffAltIcon />
                  )}
                </IconButton>
              </CardActions>
            </Box>
          </Card>
        ) : (
          <Typography>Data not Found</Typography>
        )}
      </Box>
      <Comment videoId={Number(uploadId)} />
    </>
  );
}
