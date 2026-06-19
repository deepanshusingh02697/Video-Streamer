import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Divider, Avatar } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  addComment_Mutation,
  deleteComment_Mutation,
  editComment_Mutation,
} from "../graphql/Mutation";
import type {
  AddCommentMutationMutation,
  DeleteMutationMutation,
  EditCommentMutationMutation,
} from "../types/__generated__/graphql";
import { getComment_ByVideoId } from "../graphql/Query";
import type { getComments_ByVideoId_Interface } from "../graphql/client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContextCurUser } from "../Component/Context/authContext";
import { toast } from "react-toastify";
import { socket } from "../socket";
import { client } from "../ApolloClient";

interface proptype {
  videoId: number;
}

export default function Comment({ videoId }: proptype) {
  const [isComent, setIsComment] = useState("");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [editComment, setEditComment] = useState<number | null>(null);

  const [addcommentM] = useMutation<AddCommentMutationMutation>(
    addComment_Mutation,{
      onCompleted:async()=>{
        await client.refetchQueries({
          include:"active"
        })
      }
    }
  );
  const { authUser } = useContextCurUser();
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  function callbackFunc(value: string) {
    console.log(`Fetching results for ${value}`);
  }

  function debounce(fn: any, delay: number) {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return function (this: any, ...args: any[]) {
      if (timerId !== undefined) clearTimeout(timerId);
      timerId = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  const handleDebounce = useMemo(() => debounce(callbackFunc, 500), []);

  const handleOpenMenu = (idx: number) => {
    setActiveIdx(idx);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (activeIdx === null) return;
      const ref = menuRefs.current[activeIdx];
      if (ref && !ref.contains(e.target as Node)) {
        setActiveIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeIdx]);

  useEffect(() => {
    console.log("curUserdata is : ", authUser);

    if (authUser) {
      const roomId = [authUser?.id].sort().join("-");
      console.log("room id:", roomId);
      socket.emit("joinRoom", roomId);
    }
  }, []);



  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsComment(e.target.value);
    handleDebounce(e.target.value);
  };

  const { data,refetch:refetchComment } = useQuery<getComments_ByVideoId_Interface>(
    getComment_ByVideoId,
    { variables: { videoId } },
  );

  const [deletecomment] = useMutation<DeleteMutationMutation>(
    deleteComment_Mutation,
    {
      refetchQueries: [{ query: getComment_ByVideoId }],
    },
  );

  const [updateComment] = useMutation<EditCommentMutationMutation>(
    editComment_Mutation,
    {
      refetchQueries: [{ query: getComment_ByVideoId }],
    },
  );
  useEffect(()=>{
    refetchComment()
  },[addcommentM,updateComment,data])
  const handleSubmitBtn = async () => {
    if (!isComent) return;
    if (editComment !== null) {
      await updateComment({
        variables: {
          commentId: editComment,
          comment: isComent,
        },
      });
    } else {
      const res = await addcommentM({
        variables: { videoId, comment: isComent },
      });
      console.log("res after add comment is : ", res);
    }
    setIsComment("");
    setEditComment(null);
  };

  const commentsRes = data?.getCommentById;
  if (!commentsRes) return null;

  const handleDeleteBtn = async (idx: number) => {
    try {
      const res = await deletecomment({
        variables: {
          commentId: idx,
        },
      });
      console.log(res, idx);
      setActiveIdx(null);
    } catch (error) {
      const err = error as Error;
      console.log(err);

      toast.warn(err.message, {
        position: "top-right",
        type: "success",
      });
    }
  };

  const handleEditBtn = async (idx: number, arridx: number) => {
    setEditComment(idx);
    setIsComment(commentsRes[arridx].comment);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        placeItems: "center",
        margin: "15px 0px",
        gap: "20px",
        px: { xs: 1, sm: 0 },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "89%" },
          display: "flex",
          gap: "15px",
        }}
      >
        <Avatar
          sx={{ width: 36, height: 36, background: "#00887B", color: "white" }}
        >
          {authUser?.firstname?.[0].toUpperCase()}
        </Avatar>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ display: "flex", gap: "10px", flex: "1", marginTop: "14px" }}
          >
            <input
              type="text"
              value={isComent}
              placeholder="Add a comment..."
              style={{
                outline: "none",
                border: "none",
                paddingBottom: "5px",
                width: "100%",
                fontSize: "14px",
              }}
              onChange={handleCommentChange}
            />
          </Box>
          <Divider />
          {isComent && (
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "flex-end",
                mt: 1,
                fontSize: "13px",
              }}
            >
              <Box
                onClick={() => setIsComment("")}
                sx={{ cursor: "pointer", px: 1 }}
              >
                Cancel
              </Box>
              <Box
                onClick={handleSubmitBtn}
                sx={{
                  cursor: "pointer",
                  px: 2,
                  py: 0.5,
                  borderRadius: "18px",
                  bgcolor: "#2363f8",
                  color: "#fff",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                Send
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: "100%", sm: "89%" },
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {commentsRes
          .map((cur, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                width: "100%",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: "14px" }}>
                {cur.email?.[0]?.toUpperCase()}
              </Avatar>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <Box sx={{ fontSize: "13px", fontWeight: 600 }}>
                  {cur.email}
                </Box>
                <Box sx={{ fontSize: "14px", wordBreak: "break-word" }}>
                  {cur.comment}
                </Box>
              </Box>

              <Box
                ref={(el: HTMLDivElement | null) => {
                  menuRefs.current[idx] = el;
                }}
                sx={{ position: "relative", flexShrink: 0 }}
              >
                <MoreVertIcon
                  sx={{ cursor: "pointer", flexShrink: 0 }}
                  onClick={() => handleOpenMenu(idx)}
                />
                {activeIdx === idx && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "24px",
                      right: 0,
                      background: "#fff",
                      boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                      borderRadius: "6px",
                      width: "120px",
                      zIndex: 10,
                      overflow: "hidden",
                    }}
                  >
                    {cur?.userId === authUser?.id ? (
                      <>
                        <Box
                          sx={{
                            padding: "10px 14px",
                            cursor: "pointer",
                            "&:hover": { background: "#f5f5f5" },
                          }}
                          onClick={() => handleEditBtn(cur?.id, idx)}
                        >
                          Edit
                        </Box>
                        <Box
                          sx={{
                            padding: "10px 14px",
                            cursor: "pointer",
                            "&:hover": { background: "#f5f5f5" },
                          }}
                          onClick={() => handleDeleteBtn(cur?.id)}
                        >
                          Delete
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box
                          sx={{
                            padding: "10px 14px",
                            cursor: "pointer",
                            "&:hover": { background: "#f5f5f5" },
                          }}
                        >
                          Report
                        </Box>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          ))
          .reverse()}
      </Box>
    </Box>
  );
}
