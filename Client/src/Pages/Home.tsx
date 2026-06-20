import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import { Toolbar } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Get_All_Vedios } from "../graphql/Query";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

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
  console.log(isSearchVideo);
  
  const navigate = useNavigate();
  // setSearchValuebyHook("")

  useEffect(() => {
    refetch({ search: isSearchVideo });
  }, [isSearchVideo]);

  if (loading) return <Typography variant="body1">Loading...</Typography>;

  const res = data?.getAllVideos;

  console.log("data is. : ", data);

  if (!res) {
    return <Typography variant="body1">No data Found</Typography>;
  }

  return (
    <Toolbar sx={{ display: "block", margin: "20px 0px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(350px, 1fr))",
          },
          gap: "20px",
          padding: { xs: "0 16px", sm: "0 20px" },
        }}
      >
        {res.map((ele: any, idx: number) => {
          return (
            <Card
              sx={{
                position: "relative",
                ":hover": "#E9EEF8",
                borderRadius: "15px",
              }}
              key={idx}
            >
              <CardActionArea>
                <CardMedia
                  component="video"
                  src={ele.upload_url}
                  sx={{ aspectRatio: "16 / 9", height: "auto" }}
                />
                <PlayCircleIcon
                  sx={{
                    position: "absolute",
                    color: "#fff",
                    left: "50%",
                    top: "40%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "40px",
                  }}
                  onClick={() => navigate(`upload/${ele.id}`)}
                />

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{ fontSize: "16px" }}
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
