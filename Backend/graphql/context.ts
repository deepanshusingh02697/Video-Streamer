import { Request, Response } from "express";
import { verifyaccessToken } from "../lib/jwt.cookie";
import { GraphQLError } from "graphql/error";
import { Server } from "socket.io";
import { prisma } from "../lib/prisma";

export type context = {
  userId: number | null;
  email: string | null;
  req: Request;
  res: Response;
  io: Server;
};

export const checkAuth =
  (io: Server) =>
  async ({ req, res }: { req: Request; res: Response }): Promise<context> => {
    let userId: number | null = null;
    let email: string | null = null;
    const accessToken = req.cookies.accessToken;
    console.log("accessToken is : ", accessToken);

    if (accessToken) {
      try {
        const decoded = verifyaccessToken(accessToken);
        userId = decoded.userId;
        email = decoded.email;
      } catch (error) {
        userId = null;
      }
    }
    return { req, res, userId, email, io };
  };

export const isAuth = (ctx: context) => {
  if (!ctx.userId) {
    throw new GraphQLError("Not authenticated — please log in first", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
};

export const twoUserRoomId = <T>(senderId: T, receiverId: T) => {
  return [senderId, receiverId].sort().join("-");
};

export const createAndEmitNotification = async (
  ctx: context,
  channelId: number,
  subscriber: number,
  msg: string,
) => {
  const notiMsg = await prisma.notification.create({
    data: {
      message: msg,
      senderId: subscriber,
      receiverId: channelId,
    },
    include: { sender: true, receiver: true },
  });
  console.log("message is : ", notiMsg);
  // const roomId = twoUserRoomId<number>(ctx.userId!, channelId);
  // await ctx.io.to(roomId).emit("newNotification", notiMsg);
  const roomId = String(channelId)
  await ctx.io.to(roomId).emit("newNotification", notiMsg);
  return notiMsg;
};
