import express, { Request, Response } from "express";
import mentorshipBookingsService from "../services/mentorshipBookingsService";
import { MentorshipBooking } from "../types";

const router = express.Router();

/**
 * Route to book a mentorship session.
 * @param req - The request object, expected to contain date, time, mentorId, transactionId, and userId in the body.
 * @param res - The response object.
 * @returns The created booking as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.post("/book-mentor", async (req: Request, res: Response) => {
  try {
    const { date, time, mentorId, transactionId, userId } =
      req.body as MentorshipBooking;
    const response = await mentorshipBookingsService.addBooking({
      date,
      time,
      mentorId,
      transactionId,
      userId,
    });
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Route to fetch all mentorship bookings for a given user.
 * @param req - The request object, expects a userId parameter in the route.
 * @param res - The response object.
 * @returns An array of bookings as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.get("/fetch/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const response = await mentorshipBookingsService.fetchBookings(userId);
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
