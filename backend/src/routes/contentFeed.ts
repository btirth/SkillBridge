/**
 * @author Suyash Jhawer B00968936
 */

import express from 'express';
import contentFeedService from '../services/contentFeed';
import { ContentFeed } from '../types';
import logger from '../utils/logger';

const contentFeedRouter = express.Router();

// GET all content feeds
contentFeedRouter.get('/', async (_request, response) => {
    try {
        const contentFeeds = await contentFeedService.getAllContentFeeds();
        response.send(contentFeeds);
    } catch (error) {
        logger.error("Unable to fetch content feeds", error);
        response.status(500).send({ error: "Unable to fetch content feeds" });
    }
});

// POST new content feed
contentFeedRouter.post('/', async (request, response) => {
    const newContentFeed: ContentFeed = request.body;
    try {
        const addedContentFeed = await contentFeedService.addContentFeed(newContentFeed);
        response.json(addedContentFeed);
    } catch (error) {
        logger.error("Unable to add content feed", newContentFeed, error);
        response.status(500).send({ error: "Unable to add content feed" });
    }
});

// POST to increase likes by 1 for a content feed
contentFeedRouter.post('/likes', async (request, response) => {
    const { contentFeedId , userId } = request.body;
    try {
        const updatedContentFeed = await contentFeedService.incrementLikes(contentFeedId , userId);
        response.json(updatedContentFeed);
    } catch (error) {
        logger.error("Unable to increment likes for content feed", contentFeedId, error);
        response.status(500).send({ error: "Unable to increment likes" });
    }
});

// POST to decrease likes by 1 for a content feed
contentFeedRouter.post('/likesdecrement', async (request, response) => {
    const { contentFeedId , userId} = request.body;
    try {
        const updatedContentFeed = await contentFeedService.decrementLikes(contentFeedId , userId);
        response.json(updatedContentFeed);
    } catch (error) {
        logger.error("Unable to decrement likes for content feed", contentFeedId, error);
        response.status(500).send({ error: "Unable to decrement likes" });
    }
});

// POST to add a comment to a content feed
contentFeedRouter.post('/comments', async (request, response) => {
    const { UserWhereIHaveToStoreId , UserWhoHasWritten , comment } = request.body;
    try {
        const updatedContentFeed = await contentFeedService.addComment(UserWhereIHaveToStoreId , UserWhoHasWritten, comment);
        response.json(updatedContentFeed);
    } catch (error) {
        logger.error("Unable to add comment to content feed", UserWhereIHaveToStoreId, error);
        response.status(500).send({ error: "Unable to add comment" });
    }
});

// Get comments
contentFeedRouter.get('/comments', async (request, response) => {
    const { contentFeedId } = request.body;
    try {
        const comments = await contentFeedService.getComments(contentFeedId);
        response.json(comments);
    } catch (error) {
        logger.error("Unable to get comments for content feed", contentFeedId, error);
        response.status(500).send({ error: "Unable to get comments" });
    }
});

// delete feed
contentFeedRouter.delete('/delete', async (request, response) => {
    const { contentFeedId } = request.body;
    try {
      // Assuming contentFeedService.deleteContentFeed is a function that deletes the content feed
      await contentFeedService.deleteContentFeed(contentFeedId);
      response.status(200).send({ message: 'Content feed deleted successfully' });
    } catch (error) {
      logger.error("Unable to delete content feed", contentFeedId, error);
      response.status(500).send({ error: "Unable to delete content feed" });
    }
  });

  //delete comment
  contentFeedRouter.delete('/commentdelete', async (request, response) => {
    const { contentFeedId , commentId } = request.body;
    try {
      // Assuming contentFeedService.deleteContentFeed is a function that deletes the content feed
      await contentFeedService.deleteComment(contentFeedId , commentId);
      response.status(200).send({ message: 'Content feed deleted successfully' });
    } catch (error) {
      logger.error("Unable to delete content feed", contentFeedId, error);
      response.status(500).send({ error: "Unable to delete content feed" });
    }
  });

export default contentFeedRouter;
