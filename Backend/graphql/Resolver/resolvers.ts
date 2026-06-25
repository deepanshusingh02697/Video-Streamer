import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { accessCookieOptions, setTokens } from "../../lib/jwt.cookie";
import {
  context,
  createAndEmitNotification,
  isAuth,
  twoUserRoomId,
} from "../context";

export const resolvers = {
  Query: {
    currentUser: async (_parent: unknown, _args: unknown, ctx: context) => {
      isAuth(ctx);
      try {
        return prisma.user.findUnique({
          where: { id: ctx.userId! },
          include: {
            userVideos: true,
            subscribedTo: true,
            comments: true,
            subscribers: { include: { subscriber: true } },
          },
        });
      } catch (error) {
        console.log("error in signup mutation : ", error);
        throw error;
      }
    },
    getAllVideos: async (
      _parent: unknown,
      args: { search: string },
      _ctx: unknown,
    ) => {
      console.log("args.search ===+> ", args.search);

      return prisma.video.findMany({
        where: args.search
          ? {
              title: {
                contains: args.search,
                mode: "insensitive",
              },
            }
          : {},
      });
    },
    getVideoById: async (
      _parent: unknown,
      args: { videoId: number },
      ctx: unknown,
    ) => {
      return prisma.video.findUnique({
        where: { id: args.videoId },
      });
    },
    getUserVideo: async (
      _parent: unknown,
      args: { videoId: number },
      ctx: context,
    ) => {
      return await prisma.userVideo.findUnique({
        where: {
          userId_videoId: {
            userId: ctx.userId!,
            videoId: args.videoId,
          },
        },
      });
    },
    getAllUsers: async (_parent: unknown, args: unknown, ctx: unknown) => {
      return await prisma.user.findMany({
        include: { comments: true, videos: true },
      });
    },
    getSubscribe: async (
      _parent: unknown,
      args: { channelId: number },
      ctx: context,
    ) => {
      return await prisma.subscribe.findUnique({
        where: {
          subscriberId_channelId: {
            subscriberId: ctx.userId!,
            channelId: args.channelId,
          },
        },
        include: {
          subscriber: true,
          channel: true,
        },
      });
    },
    getAllSubscribers: async (
      _parent: unknown,
      _args: unknown,
      ctx: context,
    ) => {
      isAuth(ctx);
      return await prisma.subscribe.findMany({
        where: {
          channelId: ctx.userId!,
        },
        include: {
          subscriber: true,
          channel: true,
        },
      });
    },
    getCommentById: async (
      _parent: unknown,
      args: { videoId: number },
      ctx: context,
    ) => {
      const res = await prisma.comment.findMany({
        where: {
          videoId: args.videoId,
        },
        include: { user: true, video: true },
      });
      return res;
    },
    getNotifications: async (
      _parent: unknown,
      _args: unknown,
      ctx: context,
    ) => {
      isAuth(ctx);
      return await prisma.notification.findMany({
        where: { receiverId: ctx.userId!,isRead:false },
        orderBy: { createdAt: "desc" },
        include: { sender: true, receiver: true },
      });
    },
  },
  Mutation: {
    signUp: async (
      _parent: unknown,
      args: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
      },
      _ctx: unknown,
    ) => {
      try {
        if (!args.firstname || !args.email || !args.password) {
          throw new Error("Provide all credentials");
        }
        const existingUser = await prisma.user.findUnique({
          where: { email: args.email },
        });
        if (existingUser)
          throw new Error(
            "Email already Exist- try new One",
          );

        const hashPassword = await bcrypt.hash(args.password, 10);

        const user = await prisma.user.create({
          data: {
            firstname: args.firstname,
            lastname: args.lastname,
            email: args.email,
            password: hashPassword,
          },
        });
        const { password, ...safeUser } = user;

        console.log("user signup successfully ", safeUser);

        return { user: safeUser };
      } catch (error) {
        console.log("error in signup mutation : ", error);
        throw error;
      }
    },
    logIn: async (
      _parent: unknown,
      args: {
        email: string;
        password: string;
      },
      ctx: context,
    ) => {
      try {
        if (!args.email || !args.password) {
          throw new Error("Email and Password are required ");
        }
        const user = await prisma.user.findUnique({
          where: { email: args.email.toLowerCase().trim() },
        });
        if (!user) {
          throw new Error("Invalid credentials to login ");
        }
        const passwordMatches = await bcrypt.compare(
          args.password,
          user.password,
        );

        if (!passwordMatches) {
          throw new Error("Invalid credentials to login as Admin");
        }

        setTokens(ctx.res, user.id, user.email);

        const { password, ...safeUser } = user;

        console.log("login successfull");
        return {
          user: safeUser,
        };
      } catch (error) {
        console.log("error in login mutation : ", error);
        throw error;
      }
    },

    logout: async (_parent: unknown, _args: unknown, ctx: context) => {
      ctx.res.clearCookie("accessToken", accessCookieOptions);
      return true;
    },

    uploadVideo: async (
      _parent: unknown,
      args: {
        title: string;
        duration: number;
        upload_url: string;
        description?: string;
      },
      ctx: context,
    ) => {
      isAuth(ctx);
      if (!args.title || !args.upload_url) {
        throw new Error("kindly do provide title and video");
      }
      console.log("description is : ", args.description);
      return await prisma.video.create({
        data: {
          title: args.title,
          description: args.description,
          upload_url: args.upload_url,
          duration: args.duration,
          creatorId: ctx.userId!,
        },
        include: { creator: true },
      });
    },
    likeVideo: async (
      _parent: unknown,
      args: { videoId: number; liked: boolean },
      ctx: context,
    ) => {
      isAuth(ctx);
      return await prisma.userVideo.upsert({
        where: {
          userId_videoId: {
            userId: ctx.userId!,
            videoId: args.videoId,
          },
        },
        update: { liked: args.liked },
        create: {
          userId: ctx.userId!,
          videoId: args.videoId,
          liked: args.liked,
        },
      });
    },
    subscribe: async (
      _parent: unknown,
      args: { channelId: number; subscribe: boolean },
      ctx: context,
    ) => {
      isAuth(ctx);
      console.log(args.subscribe);

      const subscription = await prisma.subscribe.upsert({
        where: {
          subscriberId_channelId: {
            subscriberId: ctx.userId!,
            channelId: args.channelId,
          },
        },
        update: { subscribe: args.subscribe },
        create: {
          subscriberId: ctx.userId!,
          channelId: args.channelId,
          subscribe: args.subscribe,
        },
        include: {
          subscriber: true,
          channel: true,
        },
      });

      const subscriber = await prisma.user.findUnique({
        where: { id: ctx.userId! },
        select: { firstname: true, lastname: true },
      });

      const checkSubscrieStatus = subscription?.subscribe;

      await createAndEmitNotification(
        ctx,
        args.channelId,
        ctx.userId!,
        `${subscriber?.firstname} ${checkSubscrieStatus ? "subscribed" : "unsubscribed"} to you`,
      );

      return subscription;
    },
    addComment: async (
      _parent: unknown,
      args: { videoId: number; comment: string },
      ctx: context,
    ) => {
      isAuth(ctx);
      console.log("email is : ", ctx.email);

      return await prisma.comment.create({
        data: {
          comment: args.comment,
          email: ctx.email,
          videoId: args.videoId,
          userId: ctx.userId!,
        },
        include: {
          user: true,
          video: true,
        },
      });
    },
    deleteComment: async (
      _parent: unknown,
      args: { commentId: number },
      ctx: context,
    ) => {
      if (!ctx.userId) {
        throw new Error("Not authenticated");
      }
      const comment = await prisma.comment.findUnique({
        where: {
          id: args.commentId,
        },
      });
      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.userId !== ctx.userId) {
        throw new Error("Not authorised to delete this comment");
      }
      return await prisma.comment.delete({
        where: { id: args.commentId },
      });
    },
    updateComment: async (
      _parent: unknown,
      args: { commentId: number; comment: string },
      ctx: context,
    ) => {
      isAuth(ctx);
      const comment = await prisma.comment.findUnique({
        where: {
          id: args.commentId,
        },
      });
      if (!comment) {
        throw new Error("Comment not found to edit");
      }
      if (comment.userId !== ctx.userId) {
        throw new Error("Not authorised to update this comment");
      }
      return await prisma.comment.update({
        where: { id: args.commentId },
        data: {
          ...(args.comment !== undefined && { comment: args.comment }),
        },
        include: {
          user: true,
          video: true,
        },
      });
    },
    sendNotification: async (
      _parent: unknown,
      args: { receiverId: number; msg: string },
      ctx: context,
    ) => {
      isAuth(ctx);
      const notiMsg = await prisma.notification.create({
        data: {
          message: args.msg,
          senderId: ctx.userId!,
          receiverId: args.receiverId,
        },
        include: { sender: true, receiver: true },
      });
      console.log("message is : ", notiMsg);
      // const roomId = twoUserRoomId<number>(ctx.userId!, args.receiverId);
      // await ctx.io.to(roomId).emit("newNotification", notiMsg);
      const roomId = String(args.receiverId);
      await ctx.io.to(roomId).emit("newNotification", notiMsg);
      return notiMsg;
    },
    updateReadNotification: async (
      _parent: unknown,
      _args: unknown,
      ctx: context,
    ) => {
      isAuth(ctx);
      await prisma.notification.updateMany({
        where:{receiverId:ctx.userId!,isRead:false},
        data:{isRead:true}
      })
      return true
    }
  },

  User: {
    subscriberCount: async (
      parent: { id: number },
      _args: unknown,
      _ctx: context,
    ) => {
      return await prisma.subscribe.count({
        where: { channelId: parent.id, subscribe: true },
      });
    },
    videoCount: async (parent: { id: number }, args: unknown, ctx: context) => {
      return await prisma.video.count({
        where: { creatorId: parent.id },
      });
    },
  },
  Video: {
    commentCount: async (
      parent: { id: number },
      _args: unknown,
      _ctx: context,
    ) => {
      return await prisma.comment.count({
        where: { videoId: parent.id },
      });
    },
    likeCount: async (parent: { id: number }, args: unknown, _ctx: unknown) => {
      return await prisma.userVideo.count({
        where: { videoId: parent.id, liked: true },
      });
    },
    dislikeCount: async (
      parent: { id: number },
      _args: unknown,
      _ctx: unknown,
    ) => {
      return await prisma.userVideo.count({
        where: { videoId: parent.id, liked: false },
      });
    },
  },
};
