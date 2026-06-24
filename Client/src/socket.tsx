import {io} from 'socket.io-client'

export const socket = io("https://video-streamer-iuxd.onrender.com/graphql", {
  withCredentials: true,
  transports:["websocket","polling"],
  autoConnect:true//socket.connect()
});