/**
 * @author Tirth Bharatiya (B00955618)
 */
import { ObjectId } from "mongodb";
import DiscussionModel from "../models/discussion";
import {
  Discussion,
  DiscussionReply,
  DiscussionSearchAndFilter,
  NewDiscussion,
  NewDiscussionReply,
} from "../types";
import UserDetailsModel from "../models/userDetails";

// default page size to apply pagination on the discussions page.
const DISCUSSION_PAGE_SIZE = 10;

/**
 * This function apply search and sort by based on given criteria.
 * @param searchAndFilter - object containing search text and sort by filter.
 * @param page - Page number for pagination.
 * @returns promise containing containing array of discussions and total number of pages.
 */
const searchAndSortDiscussions = async (
  searchAndFilter: DiscussionSearchAndFilter,
  page: number
): Promise<{ discussions: Discussion[]; totalPages: number }> => {
  try {
    const { searchText, sortBy } = searchAndFilter;
    const skip = (page - 1) * DISCUSSION_PAGE_SIZE;
    console.log(page);
    let query = {};

    if (searchText.trim() !== "") {
      query = {
        $or: [
          { title: { $regex: searchText, $options: "i" } },
          { content: { $regex: searchText, $options: "i" } },
        ],
      };
    }

    let sortCriteria = {};
    if (sortBy === "newest") {
      sortCriteria = { timestamp: -1 };
    } else if (sortBy === "oldest") {
      sortCriteria = { timestamp: 1 };
    } else if (sortBy === "mostLiked") {
      // Reference: https://stackoverflow.com/questions/32063941/how-to-sort-documents-based-on-length-of-an-array-field
      sortCriteria = { numLikes: -1, timestamp: -1 };
    }

    // Reference: https://www.mongodb.com/docs/drivers/node/current/fundamentals/aggregation/#:~:text=Aggregation%20operations%20are%20expressions%20you,specific%20operation%20on%20your%20data.
    let discussions = await DiscussionModel.aggregate([
      { $match: query },
      { $addFields: { numLikes: { $size: "$likedBy" } } },
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: DISCUSSION_PAGE_SIZE },
    ]);

    discussions = await Promise.all(discussions.map(getUpdatedDiscussionWithUserDetails));

    const totalCount = await DiscussionModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / DISCUSSION_PAGE_SIZE);
    return { discussions, totalPages };
  } catch (error) {
    throw new Error("Failed to fetch discussions.");
  }
};

/**
 * This function starts new discussion with on given information.
 * @param newDiscussion - object containing information to start new discussion.
 * @returns promise - resolves in true if discussion saved successfully, and rejects if any error occurs while saving the discussion.
 */
const startNewDiscussion = async (newDiscussion: NewDiscussion) => {
  const { title, content, tags, userId } = newDiscussion;
  const discussionEntry = new DiscussionModel({
    id: new ObjectId(),
    title,
    userId,
    content,
    tags,
    timestamp: new Date(),
    likedBy: [],
    dislikedBy: [],
    replies: [],
  });
  await discussionEntry.save();
};

/**
 * This function applys different actions on discussion.
 * @param action - It would be of type: like, dislike, remove-like, remove-dislike, reply.
 * @param userId - user id making the request.
 * @param discussionId - discussion id to make the update.
 * @returns promise containing updated discussion.
 */
const updateDiscussion = async (
  action: string,
  userId: string,
  discussionId: string
): Promise<Discussion | null> => {
  switch (action) {
    case "like":
      return await likeDiscussion(userId, discussionId);
    case "dislike":
      return await dislikeDiscussion(userId, discussionId);
    case "remove-like":
      return await removeLikeDiscussion(userId, discussionId);
    case "remove-dislike":
      return await removeDislikeDiscussion(userId, discussionId);
    default:
      // if the action is not defined, throw an error.
      throw new Error(`Invalid action: ${action}`);
  }
};

/**
 * This function is to like the discussion.
 * @param userId - user id making the request.
 * @param discussionId - discussion id to make the update.
 * @returns promise containing updated discussion.
 */
const likeDiscussion = async (
  userId: string,
  discussionId: string
): Promise<Discussion | null> => {
  await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    {
      $pull: { dislikedBy: userId },
    }
  );
  const discussion = await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    {
      $addToSet: { likedBy: userId },
    },
    { new: true }
  );

  return await getUpdatedDiscussionWithUserDetails(discussion);
};

/**
 * This function is to remove like from the discussion.
 * @param userId - user id making the request.
 * @param discussionId - discussion id to remove the like.
 * @returns promise containing updated discussion.
 */
const removeLikeDiscussion = async (
  userId: string,
  discussionId: string
): Promise<Discussion | null> => {
  const discussion = await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    {
      $pull: { likedBy: userId },
    },
    { new: true }
  );

  return await getUpdatedDiscussionWithUserDetails(discussion);
};

/**
 * This function is to dislike the discussion.
 * @param userId - user id making the request.
 * @param discussionId - discussion id to make the dislike action.
 * @returns promise containing updated discussion.
 */
const dislikeDiscussion = async (
  userId: string,
  discussionId: string
): Promise<Discussion | null> => {
  await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    {
      $pull: { likedBy: userId },
    }
  );
  const discussion = await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    {
      $addToSet: { dislikedBy: userId },
    },
    { new: true }
  );

  return await getUpdatedDiscussionWithUserDetails(discussion);
};

/**
 * This function is to dislike the discussion.
 * @param userId - user id making the request.
 * @param discussionId - discussion id to make the dislike action.
 * @returns promise containing updated discussion.
 */
const removeDislikeDiscussion = async (
  userId: string,
  discussionId: string
): Promise<Discussion | null> => {
  const discussion = await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    {
      $pull: { dislikedBy: userId },
    },
    { new: true }
  );

    return await getUpdatedDiscussionWithUserDetails(discussion);
};

/**
 * This function is to add the reply.
 * @param discussionId - discussion id in which reply need to be added.
 * @param reply - reply to add in the discussion.
 * @returns promise containing updated discussion.
 */
const addReplyToDiscussion = async (
  discussionId: string,
  reply: NewDiscussionReply
): Promise<Discussion | null> => {
    const discussionReply: DiscussionReply = {
        ...reply,
        timestamp: new Date(),
        id: new ObjectId().toString()
    }
  const discussion = await DiscussionModel.findOneAndUpdate(
    { id: discussionId },
    { $push: { replies: discussionReply }},
    { new: true }
  );

  return await getUpdatedDiscussionWithUserDetails(discussion);
};

/**
 * This function is to fetch the discussion by id.
 * @param discussionId - discussion id to fetch from the DB.
 * @returns promise containing discussion if found.
 */
const getDiscussionById = async (
  discussionId: string
): Promise<Discussion | null> => {
  const discussion = await DiscussionModel.findOne({ id: discussionId });
  return await getUpdatedDiscussionWithUserDetails(discussion)
};

/**
 * This function is to delete the discussion.
 * @param discussionId - Id of discussion to delete.
 * @returns promise that resolves to - true if the deletion was successful or false if the discussion was not found.
 */
const deleteDiscussion = async (discussionId: string) => {
  return await DiscussionModel.deleteOne({ id: discussionId });
};

/**
 * This function delete the reply from the discussion.
 * @param discussionId - Id of discussion from which reply needs to be deleted.
 * @param replyId - ID of reply to be deleted from discussion. 
 * @returns promise which resolves updated discussion or rejects if discussion does not exists.
 */
const deleteReplyFromDiscussion = async (discussionId: string, replyId: string) => {
    let discussion = await DiscussionModel.findOne({ id: discussionId });

    if (!discussion) {
        return null;
    }

    const replyIndex = discussion.replies.findIndex(reply => reply.id === replyId);
    if (replyIndex === -1) {
        return null;
    }
    discussion.replies.splice(replyIndex, 1);
    discussion = await discussion.save();
    return await getUpdatedDiscussionWithUserDetails(discussion);
}

/**
 * This function dynamically adds current user information of discussion author and reply author.
 * @param discussion - discussion without author user info and reply's author user info
 * @returns Updated discussion with all the required user information
 */
const getUpdatedDiscussionWithUserDetails = async (discussion: Discussion | null): Promise<Discussion | null> => {
  if(!discussion) {
    return null;
  }

  const userDetails = await UserDetailsModel.findOne({ uid: discussion.userId });
  if (userDetails) {
    discussion.userName = `${userDetails.firstName} ${userDetails.lastName}`;
    discussion.userImage = userDetails.image;
  }

  await Promise.all(discussion.replies.map(async (reply) => {
    const replyUserDetails = await UserDetailsModel.findOne({ uid: reply.userId });
    if (replyUserDetails) {
      reply.userName = `${replyUserDetails.firstName} ${replyUserDetails.lastName}`;
      reply.userImage = replyUserDetails.image;
    }
  }));

  return discussion;
}

export default {
  searchAndSortDiscussions,
  startNewDiscussion,
  getDiscussionById,
  deleteDiscussion,
  updateDiscussion,
  addReplyToDiscussion,
  deleteReplyFromDiscussion
};
