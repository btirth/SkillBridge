import { ObjectId } from "mongodb";
import { MentorshipBooking, MentorshipBookingItem } from "../types";
import MentorshipBookingsModel from "../models/mentorshipBookings";
import logger from "../utils/logger";
import MentorModel from "../models/mentor";

/**
 * Adds a new mentorship booking to the database.
 *
 * @param booking - A mentorship booking object containing partial information of a MentorshipBooking.
 * @returns A Promise resolving to the newly created mentorship booking object, with all fields populated, including the generated ID.
 * @throws Will throw an error if saving to the database fails.
 */
const addBooking = async (booking: Partial<MentorshipBooking>) => {
  const newBooking = new MentorshipBookingsModel({
    ...booking,
    id: new ObjectId(),
  });
  await newBooking.save();
  return newBooking;
};

/**
 * Fetches mentorship bookings for a specific user, including details of the associated mentors.
 *
 * @param userId - The ID of the user for whom to fetch mentorship bookings.
 * @returns A Promise resolving to an array of MentorshipBookingItem objects, each including the mentorship booking details along with the mentor's name and image URL.
 * @throws Will throw a custom error message if the operation fails.
 */
const fetchBookings = async (
  userId: string
): Promise<MentorshipBookingItem[]> => {
  try {
    const bookings = await MentorshipBookingsModel.find({ userId })
      .sort({ date: -1 })
      .exec();

    const bookingsWithMentorDetails = await Promise.all(
      bookings.map(async (booking) => {
        const mentor = await MentorModel.findOne({
          id: booking.mentorId,
        });

        const bookingDetails: MentorshipBooking = {
          ...booking.toObject(),
        };

        return {
          ...bookingDetails,
          mentorName: `${mentor?.firstName ?? ""} ${mentor?.lastName ?? ""}`,
          mentorImg: mentor?.imageUrl ?? "",
        };
      })
    );
    return bookingsWithMentorDetails;
  } catch (error: unknown) {
    logger.error(error);
    throw new Error("Unable to fetch mentor bookings.");
  }
};

export default {
  addBooking,
  fetchBookings,
};
