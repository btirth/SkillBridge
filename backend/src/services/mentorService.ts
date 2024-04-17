import MentorModel from "../models/mentor";
import { Mentor, NewMentor } from "../types";
import { v4 as uuidv4 } from "uuid";

const getAll = async (): Promise<Array<Mentor>> => {
  return await MentorModel.find({});
};

const addMentor = async (entry: NewMentor): Promise<Mentor> => {
  const newUserEntry = {
    ...entry,
    id: uuidv4(),
  };
  const mentor = new MentorModel(newUserEntry);
  await mentor.save();
  return mentor;
};

const getMentorById = async (id: string): Promise<Mentor | null> => {
  return await MentorModel.findOne({ id: id });
};

const updateMentor = async (
  id: string,
  mentorData: Mentor
): Promise<Mentor | null> => {
  return await MentorModel.findOneAndUpdate({ id: id }, mentorData, {
    new: true,
  });
};

export default {
  getAll,
  addMentor,
  getMentorById,
  updateMentor,
};
