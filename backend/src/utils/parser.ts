import { DiscussionSearchAndFilter, DiscussionSortByOptions, NewDiscussion, NewDiscussionReply } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

const isString = (text: any): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const parseName = (name: any): string => {
    if (!name || !isString(name)) {
        throw new Error(`Incorrect or missing name ${name}`);
    }

    return name;
};

const parseTags = (tags: any): string[] => {
    if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
        throw new Error('Tags must be an array of strings');
    }

    return tags as string[];
};

// This function parse the data into NewDiscussion.
export const toNewDiscussionEntry = (data: any): NewDiscussion => {

  return {
    title: parseName(data.title),
    userId: parseName(data.userId),
    content: parseName(data.content),
    tags: parseTags(data.tags),
  };
};

// This function parse the data into sort by options available for discussions.
const parseSortBy = (sortBy: any): DiscussionSortByOptions => {
    if (!sortBy || !isString(sortBy)) {
        throw new Error(`Incorrect or missing sortBy ${sortBy}`);
    }

    // Ensure that sortBy is one of the specific string literals
    if (sortBy !== 'newest' && sortBy !== 'oldest' && sortBy !== 'mostLiked') {
        throw new Error(`Invalid sortBy value: ${sortBy}`);
    }

    return sortBy as DiscussionSortByOptions;
};

// This function parse the data into string output.
const parseString = (name: any): string => {
    if (!name || !isString(name)) {
        return '';
    }

    return name;
};

// This function parse the data into type DiscussionReply.
export const toDiscussionSearchAndFilter = (data: any): DiscussionSearchAndFilter => {
    return {
        searchText: parseString(data.searchText),
        sortBy: parseSortBy(data.sortBy),
    }
}

// This function parse the data into type DiscussionReply.
export const toDiscussionReply = (data: any): NewDiscussionReply => {
    return {
        userId: parseName(data.userId),
        replyText: parseName(data.replyText),
    }
}