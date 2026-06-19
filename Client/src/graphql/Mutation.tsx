import { gql } from "@apollo/client";

export const Upload_Vedio_Mutation = gql`
  mutation Vedio_Mutation($title: String!, $uploadUrl: String!) {
    uploadVideo(title: $title, upload_url: $uploadUrl) {
      id
      upload_url
      title
      duration
      description
      createdAt
      updatedAt
      creatorId
      commentCount
      likeCount
      dislikeCount
    }
  }
`;

export const liked_Vedio_Mutation = gql`
  mutation LikedMutation($videoId: Int!, $liked: Boolean!) {
    likeVideo(videoId: $videoId, liked: $liked) {
      id
      liked
      userId
      videoId
    }
  }
`;

export const LOG_IN_MUTATION = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      user {
        id
        firstname
        lastname
        email
      }
    }
  }
`;
export const SIGN_UP_MUTATION = gql`
  mutation SignUp(
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    signUp(
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
    ) {
      user {
        id
        firstname
        lastname
        email
        createdAt
        updatedAt
        subscriberCount
        videoCount
      }
    }
  }
`;

export const Logout_Mutation = gql`
  mutation logout {
    logout
  }
`;

export const Liked_Vedio_Mutation = gql`
  mutation LikeVedio($videoId: Int!, $liked: Boolean!) {
    likeVideo(videoId: $videoId, liked: $liked) {
      id
      liked
      userId
      videoId
    }
  }
`;

export const Get_Video_Liked_Detail = gql`
  query getLikedVedio($videoId: Int!) {
    getUserVideo(videoId: $videoId) {
      id
      liked
      userId
      videoId
    }
  }
`;

export const subscribeChannel_Mutation = gql`
  mutation subscribeChannel($channelId: Int!, $subscribe: Boolean!) {
    subscribe(channelId: $channelId, subscribe: $subscribe) {
      id
      subscribe
      subscriberId
      channelId
    }
  }
`;

export const addComment_Mutation = gql`
  mutation addCommentMutation($videoId: Int!, $comment: String!) {
    addComment(videoId: $videoId, comment: $comment) {
      id
      comment
      videoId
      userId
      email
      createdAt
      updatedAt
    }
  }
`;

export const deleteComment_Mutation = gql`
  mutation deleteMutation($commentId: Int!) {
    deleteComment(commentId: $commentId) {
      id
      comment
      email
      videoId
      userId
      createdAt
      updatedAt
    }
  }
`;

export const editComment_Mutation = gql`
  mutation editCommentMutation($commentId: Int!, $comment: String) {
    updateComment(commentId: $commentId, comment: $comment) {
      id
      comment
      email
      videoId
      userId
      createdAt
      updatedAt
    }
  }
`;
