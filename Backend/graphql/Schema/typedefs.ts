export const typeDefs = `#graphql
type User{
    id:Int!
    firstname:String!
    lastname:String!
    email:String!
    password:String!

    createdAt:String!
    updatedAt:String!

    videos: [Video!]
    subscribedTo: [Subscribe!]
    subscribers: [Subscribe!]
    userVideos: [UserVideo!]
    comments: [Comment!]

    subscriberCount:Int!
    videoCount:Int!
}

type Video{
  id:Int!
  upload_url:  String!
  title:       String!
  duration:    Int
  description: String

  createdAt: String!
  updatedAt: String!

  creatorId: Int!
  creator:   User!

  userVideos:[UserVideo!]
  comments: [Comment!]

  commentCount:Int!
  likeCount:Int!
  dislikeCount:Int!
}

type UserVideo {
  id:    Int!
  liked: Boolean

  userId: Int!
  user:   User!

  videoId: Int!
  video:   Video!
}


type Subscribe {
  id:Int! 
  subscribe: Boolean

  subscriberId: Int!
  subscriber:   User!

  channelId: Int!
  channel:   User!
}

type Comment {
  id:      Int!   
  comment: String!
  email:String

  videoId:  Int!
  video: Video!

  userId:  Int!
  user: User!

  createdAt: String!
  updatedAt: String!
}

type AuthPayload{
    user:User!
}

type Notification{
  id:Int!
  message: String!
  isRead: Boolean!
  createdAt: String!

  receiverId:Int!
  receiver: User!

  senderId:Int!
  sender: User!
}

type Query{
    currentUser:User!
    getVideoById(videoId:Int!):Video
    getAllVideos(search:String):[Video!]

    getUserVideo(videoId:Int!):UserVideo!
    getSubscribe(channelId:Int!):Subscribe!

    getCommentById(videoId:Int!):[Comment!]!
    getAllUsers:[User!]!

    getNotifications:[Notification!]!

    getAllSubscribers:[Subscribe!]
}

type Mutation{
    signUp(firstname:String!,lastname:String!,email:String!,password:String!):AuthPayload!
    logIn(email:String!,password:String!):AuthPayload!
    logout:Boolean!

    uploadVideo(title:String!,duration:Int,upload_url:String!,description:String):Video!

    likeVideo(videoId:Int!,liked:Boolean!):UserVideo!

    subscribe(channelId:Int!,subscribe:Boolean!):Subscribe!

    addComment(videoId:Int!,comment:String!,email:String):Comment!
    deleteComment(commentId:Int!):Comment!
    updateComment(commentId:Int!, comment:String):Comment!
    sendNotification(receiverId:Int!,msg:String):Notification!
}
`;
