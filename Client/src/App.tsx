import { Route, Routes } from "react-router-dom";
import Layout from "./Component/Layout";
import Subscribe from "./Component/Subscribe";
import Home from "./Pages/Home";
import VideoUpload from "./Component/VideoUpload";
import LoginSignup from "./Component/LoginSignup/LoginSignup";
import VedioDetail from "./Pages/VedioDetail";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<LoginSignup />} />
          <Route path="upload" element={<VideoUpload />} />
          <Route path="upload/:uploadId" element={<VedioDetail />} />
          <Route path="subscriber" element={<Subscribe />} />
        </Route>
      </Routes>
    </>
  );
}
