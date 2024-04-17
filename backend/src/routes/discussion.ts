/**
 * @author Tirth Bharatiya (B00955618)
 */
import express from 'express';
import discussionService from '../services/discussionService';
import { toDiscussionReply, toDiscussionSearchAndFilter, toNewDiscussionEntry } from '../utils/parser';

const discussionRouter = express.Router();

// GET request to find the discussion based on given id.
discussionRouter.get('/:id', (request, response) => {
    const discussionId: string = request.params.id;
    discussionService.getDiscussionById(discussionId)
    .then(discussion => {
        if(!discussion) {
            return response.status(404).json({ message: `Invalid discussion id: ${discussionId}` });
        } 
        return response.status(200).json(discussion);
    })
    .catch((error: Error) => {
        return response.status(500).json({ message: `Error while retrieving discussions: ${error.message}` });
    });
});

// POST request for search & filter discussions.
discussionRouter.post('/', (request, response) => {
    const page: number = typeof request.query.page === 'string' ? parseInt(request.query.page) : 1;
    const searchAndFilter = toDiscussionSearchAndFilter(request.body);
    discussionService.searchAndSortDiscussions(searchAndFilter, page)
        .then(discussions => response.status(200).json(discussions))
        .catch((error: Error) => {
            response.status(500).json({ message: error.message });
        });
});

// POST request to create new discussion.
discussionRouter.post('/new', (request, response) => {
    const newDiscussion = toNewDiscussionEntry(request.body)
    discussionService.startNewDiscussion(newDiscussion)
    .then(() => {
        response.status(200).json({ message: "Discussion created successfully." });
    })
    .catch((error: Error) => {
        response.status(500).json({ message: `Error while creating a new discussion: ${error.message}` });
    });
});

discussionRouter.patch('/:id/:action', (request, response) => {
    const action = request.params.action;
    const discussionId = request.params.id;
    const userId: string = typeof request.query.userId === 'string' ? request.query.userId : "";

    discussionService.updateDiscussion(action, userId, discussionId)
    .then(updatedDiscussion => {
        if(!updatedDiscussion) {
            response.status(404).json({ message: `Invalid discussion id: ${discussionId}` }); 
        }
    
        return response.status(200).json(updatedDiscussion);
    })
    .catch((error: Error) => {
        return response.status(500).json({ message: `Error while performing action: ${action}: ${error.message}` })
    })
});

// POST request add a new reply in the discussion.
discussionRouter.post('/:id/reply', (request, response) => {
    const discussionId = request.params.id;
    const reply = toDiscussionReply(request.body);
    
    discussionService.addReplyToDiscussion(discussionId, reply)
    .then(updatedDiscussion => {
        if(!updatedDiscussion) {
            response.status(404).json({ message: `Invalid discussion id: ${discussionId}` }); 
        }
    
        return response.status(200).json(updatedDiscussion);
    })
    .catch((error: Error) => {
        return response.status(500).json({ message: `Error while adding reply: ${error.message}` })
    })
})

// DELETE request to delete the reply from discussion.
discussionRouter.delete('/:id/reply/:replyId', (request, response) => {
    const {id, replyId} =  request.params;
    discussionService.deleteReplyFromDiscussion(id, replyId)
    .then(updatedDiscussion => {
        if(!updatedDiscussion) {
            response.status(404).json({ message: `Invalid discussion id: ${id}` }); 
        }
    
        return response.status(200).json(updatedDiscussion);
    })
    .catch((error: Error) => {
        return response.status(500).json({ message: `Error while deleting reply: ${error.message}` })
    })
})

// DELETE request to delete the discussion.
discussionRouter.delete("/:id", (request, response) => {
    const discussionId: string = request.params.id;
    discussionService.deleteDiscussion(discussionId)
    .then(result => {
        if(result.deletedCount == 0) {
            return response.status(404).json({ message: `Invalid discussion id: ${discussionId}` });
        }
        return response.status(200).json({ message: "Discussion deleted successfully." });
    })
    .catch((error: Error) => {
        response.status(500).json({ message: `Error while deleting a discussion: ${error.message}` });
    })
})


export default discussionRouter;
