import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/Schema/typedefs";
import { resolvers } from "./graphql/Resolver/resolvers";
import express from "express";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";
import { expressMiddleware } from "@as-integrations/express5";
import { checkAuth, context } from "./graphql/context";
import uploadRouter from "./Routes/uploadRoutes";
import cors from "cors";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";


const app = express();
app.set("trust proxy", 1);
app.use(cookieParser());
const port = process.env.PORT || 4001;

const httpServer = createServer(app);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const allowedOrigin=["http://localhost:5173","https://video-streamer-client-pghg.onrender.com"]

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin, 
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connect", (socket) => {
  console.log("User connected");
  console.log("Socket id : ", socket.id);

  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`socket, socketId : ${socket.id} joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
app.use("/upload",uploadLimiter, uploadRouter);

const server = new ApolloServer<context>({
  typeDefs,
  resolvers,
  introspection: true,
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    apiLimiter,
    express.json(),
    expressMiddleware<context>(server, {
      context: checkAuth(io),
    }),
  );
  httpServer.listen(port, () => {
    console.log(`Server is ready to listen at http://localhost:${port}`);
  });
}
startServer().catch((err) => {
  console.error("Server failed to start ", err);
});
