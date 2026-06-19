import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import { Toolbar } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { Get_All_Vedios } from "../graphql/Query";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

// import type { Get_All_Vedios_Interface } from "../graphql/Client";
import { useNavigate } from "react-router-dom";
import type { Get_All_Vedios_QueryQuery } from "../types/__generated__/graphql";

export default function Home() {
  const { data, loading } = useQuery<Get_All_Vedios_QueryQuery>(Get_All_Vedios);
  const navigate = useNavigate();

  if (loading) return <Typography variant="body1">Loading...</Typography>;

  const res = data?.getAllVideos;
  if (!res) {
    return <Typography variant="body1">No data Found</Typography>;
  }

  return (
    <Toolbar sx={{ display: "grid",placeItems: "center", margin: "20px 0px" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "95%",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {res.map((ele: any, idx: number) => {
          return (
            <Card sx={{ minWidth: 350, position: "relative" }} key={idx}>
              <CardActionArea>
                <CardMedia
                  component="video"
                  src={ele.upload_url}
                  sx={{ height: 240 }}
                />
                <PlayCircleIcon
                  sx={{
                    position: "absolute",
                    size: "60px",
                    color: "#fff",
                    left: "45%",
                    top: "35%",
                    fontSize: "40px",
                  }}
                  onClick={() => navigate(`upload/${ele.id}`)}
                />

                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
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
      </Stack>
    </Toolbar>
  );
}
