/**
 * @author Suyash Jhawer B00968936
 */

import ContentFeedModel from '../models/contentFeed';
import UserDetailsModel from '../models/userDetails';
import { ContentFeed, Comment } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Function to fetch all content feeds
const getAllContentFeeds = async (): Promise<ContentFeed[]> => {
    return await ContentFeedModel.find({});
};

// Function to add a new content feed
const addContentFeed = async (entry: ContentFeed): Promise<ContentFeed> => {
    const contentFeed = new ContentFeedModel(entry);
    await contentFeed.save();
    return contentFeed;
};

//Function to increment Likes
const incrementLikes = async (contentFeedId: string, userId: string): Promise<ContentFeed | null> => {
    try {
        const contentFeed = await ContentFeedModel.findById(contentFeedId)
        if (!contentFeed) {
            throw new Error('Content feed not found');
        }
        // Check if the user already liked the content
        if (contentFeed.likes.userIds.includes(userId)) {
            throw new Error('User already liked the content');
        }
        // Add the user ID to the liked content and increment the count
        contentFeed.likes.userIds.push(userId);
        contentFeed.likes.count += 1;
        // Save the updated content feed
        await contentFeed.save();
        return contentFeed;
    } catch (error) {
        // Handle errors
        console.error('Error incrementing likes:', error);
        return null;
    }
};

// Function to decrement likes for a content feed
const decrementLikes = async (contentFeedId: string, userId: string): Promise<ContentFeed | null> => {
    try {
        const contentFeed = await ContentFeedModel.findById(contentFeedId);
        if (!contentFeed) {
            throw new Error('Content feed not found');
        }
        // Check if the user has liked the content to decrement likes
        const userIndex = contentFeed.likes.userIds.indexOf(userId);
        if (userIndex === -1) {
            throw new Error('User has not liked the content');
        }
        // Remove the user ID from the liked content and decrement the count
        contentFeed.likes.userIds.splice(userIndex, 1);
        contentFeed.likes.count -= 1;
        // Save the updated content feed
        await contentFeed.save();
        return contentFeed;
    } catch (error) {
        // Handle errors
        console.error('Error decrementing likes:', error);
        return null;
    }
};

// Function to add a comment to a content feed
const addComment = async (UserWhereIHaveToStoreId: string, UserWhoHasWritten: string , comment : string): Promise<ContentFeed | null> => {
    try {
        const UserStore = await ContentFeedModel.findById(UserWhereIHaveToStoreId);
        if (!UserStore) {
            throw new Error('Content feed not found');
        }
        const UserWhoWrote = await UserDetailsModel.findOne({uid: UserWhoHasWritten});
        if (!UserWhoWrote) {
            throw new Error('Content feed not found');
        }
        const newCommentId = uuidv4();
        const commentToAdd: Comment = {
            id: newCommentId,
            userId : UserWhoWrote.uid,
            name: UserWhoWrote.firstName+" "+UserWhoWrote.lastName,
            image: UserWhoWrote.image,
            comment: comment,
        };
        console.log(commentToAdd)
        // Add the comment to the comments array
        UserStore.comments.push(commentToAdd);
        await UserStore.save();
        return UserStore;
    } catch (error) {
        // Handle errors
        console.error('Error adding comment:', error);
        return null;
    }
};

//Function to get Comments
const getComments = async (contentFeedId: string): Promise<Comment[] | null> => {
    try {
        const contentFeed = await ContentFeedModel.findOne({id: contentFeedId});
        if (!contentFeed) {
            throw new Error('Content feed not found');
        }
        // Return the comments array from the content feed
        return contentFeed.comments;
    } catch (error) {
        // Handle errors
        console.error('Error fetching comments:', error);
        return null;
    }
};

//Function to delete content feed based on user ID
const deleteContentFeed = async (contentFeedId: string): Promise<boolean> => {
    try {
        const deletedContentFeed = await ContentFeedModel.findByIdAndDelete(contentFeedId);

        if (!deletedContentFeed) {
            throw new Error('Content feed not found');
        }
        // Return true to indicate successful deletion
        return true;
    } catch (error) {
        // Handle errors
        console.error('Error deleting content feed:', error);
        return false;
    }
};

//Function to delete comment based on user id
const deleteComment = async (contentFeedId: string, commentId: Object): Promise<boolean> => {
    try {
      // Find the content feed by ID
      const contentFeed = await ContentFeedModel.findById(contentFeedId);
      if (!contentFeed) {
        throw new Error('Content feed not found');
      }
      // Find the index of the comment to be deleted
      const commentIndex = contentFeed.comments.findIndex(comment => comment.id === commentId);
      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }
      // Remove the comment from the array
      contentFeed.comments.splice(commentIndex, 1);
      // Save the updated content feed
      await contentFeed.save();
      // Return true to indicate successful deletion
      return true;
    } catch (error) {
      // Handle errors
      console.error('Error deleting comment:', error);
      return false;
    }
  };

export default {
    getAllContentFeeds,
    addContentFeed,
    incrementLikes,
    addComment,
    getComments,
    decrementLikes,
    deleteContentFeed,
    deleteComment
};
