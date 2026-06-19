export interface Get_All_Vedios_Interface {
  getAllVideos: [
    {
      id: number;
      upload_url: string;
      title: string;
      duration: number;
      description: string;
      createdAt: string;
      updatedAt: string;
      creatorId: number;
      commentCount: number;
      likeCount: number;
      dislikeCount: number;
    },
  ];
}

export interface Get_Video_ById_Interface {
  getVideo: {
    id: number;
    upload_url: string;
    title: string;
    duration: number;
    description: number;
    createdAt: string;
    updatedAt: string;
    creatorId: number;
    commentCount: number;
    likeCount: number;
    dislikeCount: number;
  };
}

export interface Get_BubscribeOrNot_Interface {
  getSubscribe: {
    id: number;
    subscribe: boolean;
    subscriberId: number;
    channelId: number;
  };
}

export interface getComments_ByVideoId_Interface {
  getCommentById: [
    {
      id: number;
      comment: string;
      email: string;
      videoId: number;
      userId: number;
      createdAt: string;
      updatedAt: string;
    },
  ];
}

export interface getSubscribed_Query_Interface {
  getAllSubscribers: [
    {
      id: number;
      subscribe: boolean;
      subscriberId: number;
      subscriber: {
        firstname: string;
        lastname: string;
        email: string;
        createdAt: string;
      };
      channelId: number;
    },
  ];
}
