import {
  BookMentor,
  BookingDetails,
  MentorBooking,
  MentorDetails,
} from "../models/BookMentor.model";
import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
const BOOKING_URL = `${BASE_URL}/bookings`;

/**
 * Manages the state and interactions related to booking mentor sessions in the application.
 * It contains methods for adding a mentor booking, fetching mentor bookings for a user,
 * and updating booking details.
 */
export class BookingStore {
  rootStore: RootStore;
  bookMentor: BookMentor = {
    mentorDetails: {
      availability: [],
      bio: "",
      hourlyRate: 0,
      name: "",
      id: "",
    },
    bookingDetails: { date: null, time: "" },
    bookingSuccessFull: false,
  };
  mentorBookings: MentorBooking[] = [];
  isBookingsLoading = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  /**
   * Adds a mentor booking for the current user.
   *
   * @param transactionId - The ID of the transaction associated with this booking.
   * @returns A promise resolving to the response from the bookings API.
   * @throws An error if the booking operation fails.
   */
  async addMentorBooking(transactionId: string) {
    const userId = sessionStorage.getItem("userId");
    try {
      const response = await axios.post(`${BOOKING_URL}/book-mentor`, {
        date: this.bookMentor.bookingDetails.date,
        time: this.bookMentor.bookingDetails.time,
        userId,
        transactionId,
        mentorId: this.bookMentor.mentorDetails.id,
      });
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response?.data) {
        const { message } = axiosError.response.data;
        throw new Error(message);
      } else {
        throw new Error("Failed to book mentor");
      }
    }
  }

  /**
   * Fetches all mentor bookings for the current user from the backend.
   * Updates the `mentorBookings` array with the fetched data.
   *
   * @throws An error if fetching the bookings fails.
   */
  async fetchMentorBookings() {
    const userId = sessionStorage.getItem("userId");
    this.isBookingsLoading = true;
    await axios
      .get<MentorBooking[]>(`${BOOKING_URL}/fetch/${userId}`)
      .then((response) => {
        this.mentorBookings = [...response.data];
      })
      .catch((error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data) {
          const { message } = axiosError.response.data;
          throw new Error(message);
        } else {
          throw new Error("Failed to fetch mentor bookings");
        }
      });
    this.isBookingsLoading = false;
  }

  /**
   * Updates the booking details for the current mentor booking process.
   *
   * @param bookingDetails - A partial object containing the booking details to be updated.
   */
  updateBookingDetails(bookingDetails: Partial<BookingDetails>) {
    this.bookMentor.bookingDetails = {
      ...this.bookMentor.bookingDetails,
      ...bookingDetails,
    };
  }

  /**
   * Updates the mentor details for the current mentor booking process.
   *
   * @param mentorDetails - A partial object containing the mentor details to be updated.
   */
  updateMentorDetails(mentorDetails: Partial<MentorDetails>) {
    this.bookMentor.mentorDetails = {
      ...this.bookMentor.mentorDetails,
      ...mentorDetails,
    };
  }

  /**
   * Resets the `bookMentor` object to its initial state, clearing all current booking and mentor details.
   */
  resetBookMentor() {
    this.bookMentor = {
      mentorDetails: {
        availability: [],
        bio: "",
        hourlyRate: 0,
        name: "",
        id: "",
      },
      bookingDetails: { date: null, time: "" },
      bookingSuccessFull: false,
    };
  }
}
