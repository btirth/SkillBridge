import { Dayjs } from "dayjs";
import { Availability } from "../models/BookMentor.model";

/**
 * Formats a Dayjs date object into a human-readable string.
 *
 * @param dateValue - The Dayjs date object to be formatted.
 * @returns A string representing the formatted date in the format "MMM DD, YYYY hh:mm a".
 */
export const formatDate = (
  dateValue: Dayjs,
  dateFormat = "MMM DD, YYYY hh:mm a"
) => {
  return dateValue.format(dateFormat);
};

/**
 * Converts a weekday name into its corresponding day number, with Sunday as 0 and Saturday as 6.
 *
 * @param day - The name of the day (case-insensitive).
 * @returns The number representing the day of the week, where Sunday is 0 and Saturday is 6.
 *          Returns -1 if the input does not match any day of the week.
 */
export const getDayNumber = (day: string) => {
  switch (day.toLowerCase()) {
    case "sunday":
      return 0;
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "wednesday":
      return 3;
    case "thursday":
      return 4;
    case "friday":
      return 5;
    case "saturday":
      return 6;
    default:
      return -1;
  }
};

/**
 * Generates a list of time slots available for a given day based on a mentor's availability.
 *
 * @param date - The Dayjs object representing the specific date for which to generate time slots.
 * @param availabilities - An array of availability objects for the mentor.
 * @returns An array of strings, each representing an available time slot in "HH:mm" format. Returns an empty array if no availability is found for the given day.
 */
export const generateTimeSlots = (
  date: Dayjs | null,
  availabilities: Availability[]
): string[] => {
  if (!date) {
    return [];
  }

  const dayOfWeek = date.format("dddd");
  const availability = availabilities.find((avail) => avail.day === dayOfWeek);

  if (!availability) {
    return [];
  }

  const startTimeParts = availability.startTime.split(":").map(Number);
  const endTimeParts = availability.endTime.split(":").map(Number);

  const startTime = date
    .set("hour", startTimeParts[0])
    .set("minute", startTimeParts[1]);
  const endTime = date
    .set("hour", endTimeParts[0])
    .set("minute", endTimeParts[1]);

  const timeSlots: string[] = [];
  let currentTime = startTime;

  while (currentTime < endTime) {
    timeSlots.push(currentTime.format("HH:mm"));
    currentTime = currentTime.add(1, "hour");
  }

  return timeSlots;
};

export const getToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const getUserIdFromSession = () => {
  return sessionStorage.getItem("userId");
};
