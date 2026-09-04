import {io} from 'socket.io-client'

export const socket = io("https://video-streamer-iuxd.onrender.com/graphql", {
// export const socket = io("http://localhost:4002/graphql", {
  withCredentials: true,
  transports:["websocket","polling"],
  autoConnect:true
});