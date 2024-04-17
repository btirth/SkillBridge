import mongoose, { ObjectId } from "mongoose";

export interface User {
  id: string;
  name: string;
}

export interface Comment {
  id: string;
  userId: string;
  name: string;
  image: string;
  comment: string;
}

export interface LikesData {
  userIds: string[]; // Array of user IDs who liked the content
  count: number; // Count of likes
}

export interface ContentFeed {
  id: string;
  name: string;
  feed: string;
  likes: LikesData;
  comments: Comment[];
  datePublish: Date;
  image: string;
}

export interface Mentor {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  imageUrl: string;
  ratings: string;
  bio: string;
  email: string;
  phoneNumber: string;
  experience: string;
  pay: string;
  expertise: string;
  resume: string;
  availability: string;
  termsAccepted: string;
}

export type NewMentor = Partial<Mentor>;
export interface UserDetails {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  dob: Date;
  profession: string;
  companyName: string;
  stripeCustomerId: string;
}

export interface DiscussionReply {
  id: string;
  userId: string;
  replyText: string;
  timestamp: Date;
  userName?: string;
  userImage?: string;
}

export interface NewDiscussionReply {
  userId: string;
  replyText: string;
}

export interface Discussion {
  id: string;
  title: string;
  userId: string;
  content: string;
  tags: string[];
  timestamp: Date;
  likedBy: string[];
  dislikedBy: string[];
  replies: DiscussionReply[];
  userName: string;
  userImage: string;
}

export interface DiscussionSearchAndFilter {
  searchText: string;
  sortBy: DiscussionSortByOptions;
}

export interface NewDiscussion {
  title: string;
  userId: string;
  content: string;
  tags: string[];
}

export type DiscussionSortByOptions = "newest" | "oldest" | "mostLiked";

export type NewUser = Omit<UserDetails, "id">;

export interface Transaction {
  id: string;
  amount: number;
  userId: string;
  stripeTransactionId: string;
  paymentMethodId: string;
  description: string;
  createdAt: Date;
}

export enum experienceLevels {
  internship = "Internship",
  entry = "Entry",
  associate = "Associate",
  senior = "Senior",
  director = "Director",
  executive = "Executive",
}

export enum jobTypes {
  partTime = "Part-time",
  fullTime = "Full-time",
  contract = "Contract",
  internship = "Internship",
}

export enum locationProvinces {
  ON = "Ontario",
  BC = "British Columbia",
  QC = "Quebec",
  AB = "Alberta",
  MB = "Manitoba",
  SK = "Saskatchewan",
  NS = "Nova Scotia",
  NB = "New Brunswick",
  NL = "Newfoundland and Labrador",
  PE = "Prince Edward Island",
  YT = "Yukon",
  NT = "Northwest Territories",
  NU = "Nunavut",
}

export interface Job {
  id: string;
  title: string;
  description: string;
  companyDetails: string;
  createDate: Date;
  experienceLevel: experienceLevels;
  type: jobTypes;
  userId: string;
  city: string;
  province: locationProvinces;
}

export type NewJobData = Omit<Job, "id">;

export type NewJobErrorData = {
  [P in keyof NewJobData]: string;
};

export interface MentorshipBooking {
  id: string;
  date: Date;
  time: string;
  mentorId: string;
  transactionId: string;
  userId: string;
  _id?: ObjectId;
}

export interface MentorshipBookingItem {
  id: string;
  date: Date;
  time: string;
  mentorId: string;
  transactionId: string;
  userId: string;
  mentorName: string;
  mentorImg: string;
}

export interface UserConnections {
  uid: string;
  requestSent: string[];
  requestReceived: string[];
  myConnections: string[];
}
export interface Message {
  senderId: string,
  receiverId: string,
  message: string,
}

export interface Conversation extends Document  {
  participants: Array<string>,
  messages: Array<mongoose.Types.ObjectId>
}