import { useQuery } from "@apollo/client/react";
import { get_AllSubscribed_Query } from "../graphql/Query";
import { Typography } from "@mui/material";
import type { getSubscribed_Query_Interface } from "../graphql/client";
import { useContextCurUser } from "./Context/authContext";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

export default function Subscribe() {
  const { data, loading } = useQuery<getSubscribed_Query_Interface>(
    get_AllSubscribed_Query,
  );
  const { authUser } = useContextCurUser();
  const navigate = useNavigate();
  if (loading) {
      return (
        <Typography
          sx={{
            width: "100vw",
            minHeight: "80vh",
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

  // console.log("subscriber data is : ", data);

  if (!authUser) {
    navigate("/login");
    return;
  }
  const subscribers = data?.getAllSubscribers;

  if (!subscribers) {
    return (
      <Typography sx={{ display: "grid", placeItems: "center" }}>
        No Subscribers!
      </Typography>
    );
  }
  return (
    <div style={{ display: "grid", placeItems: "center",     marginTop:"20px"}}>
      <table className="table" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subscribed At</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((ele, idx) => {
            return (
              <>
                <tr key={idx}>
                  <td>
                    {ele?.subscriber?.firstname} {ele?.subscriber.lastname}
                  </td>
                  <td>{ele?.subscriber?.email}</td>
                  <td>
                    {new Date(
                      Number(ele?.subscriber?.createdAt),
                    ).toLocaleTimeString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
