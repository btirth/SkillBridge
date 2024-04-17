/**
 * @author Tirth Bharatiya (B00955618)
 */
export interface DiscussionModel {
    id: string;
    title: string;
    content: string;
    tags: string[];
    timestamp: Date;
    userId: string;
    likedBy: string[];
    dislikedBy: string[];
    replies: DiscussionReplyModel[];
    userName: string;
    userImage: string;
  }

  export interface DiscussionReplyModel {
    id: string;
    userId: string;
    replyText: string;
    timestamp: Date;
    userName: string;
    userImage: string;
  }

  export interface NewDiscussionReplyModel {
    userId: string;
    replyText: string;
    timestamp: Date;
  }
  
  export interface DiscussionSearchAndFilterModel {
    searchText: string;
    sortBy: 'newest' | 'oldest' | 'mostLiked';
  }

  export interface NewDiscussionSubmitDataModel {
    title: string;
    userId: string;
    content: string;
    tags: string[];
  }

  export interface NewDiscussionFormDataModel {
    title: string;
    content: string;
    tags: string[];
  }
  
  export interface NewDiscussionValidationErrorModel {
    title: string;
    content: string;
    tags: string;
  }