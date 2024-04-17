/**
 * @author Tirth Bharatiya (B00955618)
 */
import axios from "axios";
import { DiscussionModel, DiscussionSearchAndFilterModel, NewDiscussionReplyModel, NewDiscussionSubmitDataModel } from "../../models/discussions.model";
import React from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL
const DISCUSSION_URL = `${BASE_URL}/discussions`

/**
 * API call to fetch the discussions with search, sort by and pagination
 * @param searchAndFilter - Contains information about search text and sort by mode.
 * @param page - page no. for pagination
 * @returns Fetched list of discussions from backend or error.
 */
export const fetchDiscussions = async (searchAndFilter: DiscussionSearchAndFilterModel, page: number) => {
    const response = await axios.post<{ discussions: DiscussionModel[], totalPages: number }>(`${DISCUSSION_URL}?page=${page}`, searchAndFilter, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
};

/**
 * API call to fetch discussion with given id.
 * @param discussionId - ID of the discussion to fetch.
 * @returns Discussion with all the information for given ID or error if discussion does not exist.
 */
export const fetchDiscussion = async (discussionId: string) => {
    const response = await axios.get<DiscussionModel>(`${DISCUSSION_URL}/${discussionId}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response;
};

/**
 * API call to like, dislike, remove like or remove dislike
 * @param discussionId - ID of the discussion to make the update.
 * @param userId - ID of the user who is making the request.
 * @param action - Action to perfrom, like/dislike/remove-like/remove-dislike
 * @returns Updated discussion after applying action or error if update fails.
 */
export const updateLikeDisLike = async (discussionId: string, userId: string, action: string) => {
    const url = `${DISCUSSION_URL}/${discussionId}/${action}?userId=${userId}`;
    return await axios.patch<DiscussionModel>(url);
};

/**
 * API call to add the reply to discussion
 * @param discussionId - ID of discussion in which reply needs to be added.
 * @param reply - Information for reply to add in discussion
 * @returns Updated discussion after adding reply or error if update fails.
 */
export const replyToDiscussion = async (discussionId: string, reply: NewDiscussionReplyModel) => {
    const url = `${DISCUSSION_URL}/${discussionId}/reply`;
    return await axios.post<DiscussionModel>(url, reply);
};

/**
 * API call to delete reply from discussion.
 * @param discussionId - ID of discussion from which reply needs to be deleted.
 * @param replyId - ID of reply which needs to be deleted.
 * @returns Updated discussion after deleting reply or error if update fails (discussion or reply does not exists for given ids).
 */
export const deleteReplyFromDiscussion = async (discussionId: string, replyId: string) => {
    const url = `${DISCUSSION_URL}/${discussionId}/reply/${replyId}`;
    return await axios.delete<DiscussionModel>(url);
};

/**
 * API call to start a new discussion.
 * @param newDiscussionData - Information required to start a new discussion.
 * @returns response status == 200 if discussion created successfully.
 */
export const startDiscussion = async (newDiscussionData: NewDiscussionSubmitDataModel) => {
    const url = `${DISCUSSION_URL}/new`
    return await axios.post(url, newDiscussionData)
}

/**
 * API call to delete the discussion.
 * @param discussionId 
 * @returns Response status == 200 if discussion deleted successfully.
 */
export const deleteDiscussion = async (discussionId: string) => {
    const url = `${DISCUSSION_URL}/${discussionId}`;
    return await axios.delete(url);
}

/**
 * Function responsible to formate the content (new line/ empty line / list) before rendering it in frontend.
 * Reference: https://stackoverflow.com/questions/35351706/how-to-render-a-multi-line-text-string-in-react
 * @param content - Content received from backend.
 * @returns Formated content to render.
 */
export const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.trim().startsWith('- ')) {
        return React.createElement('li', { key: index }, line.trim().substring(2));
      } else if (line.trim().match(/^\d+\. /)) {
        return React.createElement('li', { key: index }, line.trim().substring(line.indexOf('.') + 1));
      }
      return React.createElement('p', { key: index }, line);
    });
  }