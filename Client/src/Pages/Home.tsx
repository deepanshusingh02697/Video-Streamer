import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import { Toolbar } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Get_All_Vedios } from "../graphql/Query";
import "@fontsource/roboto/500.css";
import { TailSpin } from "react-loader-spinner";

import { useNavigate } from "react-router-dom";
import type { Get_All_Vedios_QueryQuery } from "../types/__generated__/graphql";
import { useEffect } from "react";
import { useSearchVideo } from "../Component/Context/searchVideo";

export default function Home() {
  const { isSearchVideo } = useSearchVideo();

  const { data, loading, refetch } = useQuery<Get_All_Vedios_QueryQuery>(
    Get_All_Vedios,
    {
      variables: {
        search: isSearchVideo,
      },
    },
  );
  console.log("Get_All_Vedios ====> ", data);

  const navigate = useNavigate();
  // setSearchValuebyHook("")

  useEffect(() => {
    refetch({ search: isSearchVideo });
  }, [isSearchVideo]);

  if (loading) {
    return (
      <Typography
        sx={{
          width: "100vw",
          height: "90vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <TailSpin
          height="70"
          width="70"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          visible={loading}
        />
      </Typography>
    );
  }

  const res = data?.getAllVideos;

  console.log("data is. : ", data);

  if (!res) {
    return (
      <Typography
        variant="body1"
        sx={{
          display: "grid",
          placeItems: "center",
          width: "100vw",
          minHeight: "80vh",
        }}
      >
        No Video Found  
      </Typography>
    );
  }

  return (
    <Toolbar sx={{ display: "block", margin: {xs:"2px 0px", sm:"20px 0px"} }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(350px, 1fr))",
          },
          gap: "5px",
          padding: { xs: "0px", sm: "0 20px" },
        }}
      >
        {res.map((ele: any, idx: number) => {
          return (
            <Card
              sx={{
                background: "#FFFFFF",
                boxShadow: "none",
                ":hover": {
                  background: "#E9EEF8",
                  borderRadius: "14px",
                },
              }}
              key={idx}
            >
              <CardActionArea
                sx={{
                  padding: "10px 6px 6px 6px",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <CardMedia
                  component="video"
                  src={ele.upload_url}
                  sx={{
                    aspectRatio: "16 / 9",
                    height: "auto",
                    width: {xs:"100%",sm:"98%"},
                    borderRadius: "16px",
                  }}
                  onClick={() => navigate(`upload/${ele.id}`)}
                />
                <CardContent sx={{ width: "100%",padding:{xs:"16px 8px",sm:"16px 12px"} }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontSize: "16px", fontFamily: "Roboto" }}
                  >
                    {ele.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {ele.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </Box>
    </Toolbar>
  );
}
