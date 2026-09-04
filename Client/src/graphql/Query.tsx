import { gql } from "@apollo/client";

export const getCurUser_Query = gql`
  query currUser {
    currentUser {
      id
      firstname
      lastname
      email
      createdAt
      updatedAt
      subscriberCount
      videoCount
      subscribedTo {
        channelId
      }
      userVideos {
        liked
        videoId
      }
    }
  }
`;
export const Get_All_Vedios = gql`
  query Get_All_Vedios_Query($search: String) {
    getAllVideos(search: $search) {
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

export const Get_Video_ById = gql`
  query Query($videoId: Int!) {
    getVideoById(videoId: $videoId) {
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

export const getSubscribeOrNotById = gql`
  query SubscribeGetById($getSubscribeChannelId2: Int!) {
    getSubscribe(channelId: $getSubscribeChannelId2) {
      id
      subscribe
      subscriberId
      channelId
    }
  }
`;

export const getComment_ByVideoId = gql`
  query getCommentsById($videoId: Int!) {
    getCommentById(videoId: $videoId) {
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

export const getNotifications = gql`
  query GetNotifications {
    getNotifications {
      id
      message
      isRead
      createdAt
      sender {
        firstname
        lastname
      }
    }
  }
`;

export const get_Subscriber_Query = gql`
  query Query($channelId: Int!) {
    getSubscribe(channelId: $channelId) {
      id
      subscriberId
      subscriber {
        firstname
        id
      }
      channelId
      subscribe
      channel {
        id
      }
    }
  }
`;

export const get_AllSubscribed_Query = gql`
  query Query {
    getAllSubscribers {
      id
      subscribe
      subscriberId
      subscriber {
        firstname
        lastname
        email
        createdAt
      }
    }
  }
`;
