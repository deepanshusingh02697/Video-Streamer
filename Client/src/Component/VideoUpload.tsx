import { useMutation, useQuery } from "@apollo/client/react";
import {
  Toolbar,
  Stack,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Upload_Vedio_Mutation } from "../graphql/Mutation";
import { useEffect, useState } from "react";
import type {
  CurrUserQuery,
  Vedio_MutationMutation,
} from "../types/__generated__/graphql";
import { toast } from "react-toastify";
import { getCurUser_Query } from "../graphql/Query";
import { useNavigate } from "react-router-dom";

export default function VideoUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const { data } = useQuery<CurrUserQuery>(getCurUser_Query);

  const [upload_vedio] = useMutation<Vedio_MutationMutation>(
    Upload_Vedio_Mutation,
  );

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, [data]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      console.log(e.target.files);
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file || !title) {
      toast("File and title of video required");
      return;
    }
    console.log(title,description);
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("videoStream", file);

      // const res = await fetch("http://localhost:4002/upload/video", {
      const res=await fetch("https://video-streamer-iuxd.onrender.com/upload/video",{
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Video upload failed");
      const data = await res.json();

      await upload_vedio({
        variables: {
          title,
          uploadUrl: data.url,
          description: description
        },
      });

      setTitle("");
      setDescription("");
      setFile(null);
      toast("data submitted successfylly");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Toolbar sx={{ display: "grid", placeItems: "center" }}>
      <Stack
        direction="column"
        spacing={2}
        sx={{ width: "85%", maxWidth: 500 }}
      >
        <Typography variant="h6">Upload Video</Typography>

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          fullWidth
        />

        <Button variant="outlined" component="label">
          {file ? file.name : "Select Video File"}
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={handleFileChange}
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={18} /> : null}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </Stack>
    </Toolbar>
  );
}
