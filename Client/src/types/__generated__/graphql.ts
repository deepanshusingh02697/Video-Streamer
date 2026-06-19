/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Vedio_MutationMutationVariables = Exact<{
  title: string;
  uploadUrl: string;
}>;


export type Vedio_MutationMutation = { uploadVideo: { __typename: 'Video', id: number, upload_url: string, title: string, duration: number | null, description: string | null, createdAt: string, updatedAt: string, creatorId: number, commentCount: number, likeCount: number, dislikeCount: number } };

export type LikedMutationMutationVariables = Exact<{
  videoId: number;
  liked: boolean;
}>;


export type LikedMutationMutation = { likeVideo: { __typename: 'UserVideo', id: number, liked: boolean | null, userId: number, videoId: number } };

export type LogInMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LogInMutation = { logIn: { __typename: 'AuthPayload', user: { __typename: 'User', id: number, firstname: string, lastname: string, email: string } } };

export type SignUpMutationVariables = Exact<{
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}>;


export type SignUpMutation = { signUp: { __typename: 'AuthPayload', user: { __typename: 'User', id: number, firstname: string, lastname: string, email: string, createdAt: string, updatedAt: string, subscriberCount: number, videoCount: number } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type LikeVedioMutationVariables = Exact<{
  videoId: number;
  liked: boolean;
}>;


export type LikeVedioMutation = { likeVideo: { __typename: 'UserVideo', id: number, liked: boolean | null, userId: number, videoId: number } };

export type GetLikedVedioQueryVariables = Exact<{
  videoId: number;
}>;


export type GetLikedVedioQuery = { getUserVideo: { __typename: 'UserVideo', id: number, liked: boolean | null, userId: number, videoId: number } };

export type SubscribeChannelMutationVariables = Exact<{
  channelId: number;
  subscribe: boolean;
}>;


export type SubscribeChannelMutation = { subscribe: { __typename: 'Subscribe', id: number, subscribe: boolean | null, subscriberId: number, channelId: number } };

export type AddCommentMutationMutationVariables = Exact<{
  videoId: number;
  comment: string;
}>;


export type AddCommentMutationMutation = { addComment: { __typename: 'Comment', id: number, comment: string, videoId: number, userId: number, email: string | null, createdAt: string, updatedAt: string } };

export type DeleteMutationMutationVariables = Exact<{
  commentId: number;
}>;


export type DeleteMutationMutation = { deleteComment: { __typename: 'Comment', id: number, comment: string, email: string | null, videoId: number, userId: number, createdAt: string, updatedAt: string } };

export type EditCommentMutationMutationVariables = Exact<{
  commentId: number;
  comment?: string | null | undefined;
}>;


export type EditCommentMutationMutation = { updateComment: { __typename: 'Comment', id: number, comment: string, email: string | null, videoId: number, userId: number, createdAt: string, updatedAt: string } };

export type CurrUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrUserQuery = { currentUser: { __typename: 'User', id: number, firstname: string, lastname: string, email: string, password: string, createdAt: string, updatedAt: string, subscriberCount: number, videoCount: number, subscribedTo: Array<{ __typename: 'Subscribe', channelId: number }> | null, userVideos: Array<{ __typename: 'UserVideo', liked: boolean | null, videoId: number }> | null } };

export type Get_All_Vedios_QueryQueryVariables = Exact<{ [key: string]: never; }>;


export type Get_All_Vedios_QueryQuery = { getAllVideos: Array<{ __typename: 'Video', id: number, upload_url: string, title: string, duration: number | null, description: string | null, createdAt: string, updatedAt: string, creatorId: number, commentCount: number, likeCount: number, dislikeCount: number }> | null };

export type QueryQueryVariables = Exact<{
  videoId: number;
}>;


export type QueryQuery = { getVideoById: { __typename: 'Video', id: number, upload_url: string, title: string, duration: number | null, description: string | null, createdAt: string, updatedAt: string, creatorId: number, commentCount: number, likeCount: number, dislikeCount: number } | null };

export type SubscribeGetByIdQueryVariables = Exact<{
  getSubscribeChannelId2: number;
}>;


export type SubscribeGetByIdQuery = { getSubscribe: { __typename: 'Subscribe', id: number, subscribe: boolean | null, subscriberId: number, channelId: number } };

export type GetCommentsByIdQueryVariables = Exact<{
  videoId: number;
}>;


export type GetCommentsByIdQuery = { getCommentById: Array<{ __typename: 'Comment', id: number, comment: string, email: string | null, videoId: number, userId: number, createdAt: string, updatedAt: string }> };

export type GetNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNotificationsQuery = { getNotifications: Array<{ __typename: 'Notification', id: number, message: string, isRead: boolean, createdAt: string, sender: { __typename: 'User', firstname: string, lastname: string } }> };
