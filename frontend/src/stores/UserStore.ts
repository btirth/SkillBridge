import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { UserDetails } from "../models/UserDetatils.model";
import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";
const USERS_URL = `${BASE_URL}/userDetails`;

/**
 * Manages the user state within the application, including user details.
 */
export class UserStore {
  rootStore: RootStore;
  userDetails: UserDetails = {
    email: "",
    firstName: "",
    lastName: "",
    image: "",
    uid: "",
  };
  allUsers: UserDetails[] = [];
  myConnections: UserDetails[] = [];
  isConnectionsLoading: boolean = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  /**
   * Fetches the details of the current user from the backend API and updates the store's state.
   * This method uses the user ID stored in the session storage to request user details,
   * then updates the `userDetails` property with the fetched data.
   *
   * @throws An error if the request fails, including network issues or if the user ID does not exist.
   */
  async fetchUserDetails() {
    const userId = sessionStorage.getItem("userId");
    await axios
      .get<UserDetails>(`${USERS_URL}/${userId}`)
      .then((response) => {
        this.userDetails = { ...response.data };
      })
      .catch((error: AxiosError<{ message: string }, unknown>) => {
        throw new Error(
          error?.response?.data?.message ?? "Failed to fetch user details"
        );
      });
  }

  /**
   * Fetches all the users in the system.
   *
   * @throws An error if the request fails, including network issues or if the user ID does not exist.
   */
  async fetchAllUsers() {
    await axios
      .get<UserDetails[]>(`${USERS_URL}/`)
      .then((response) => {
        this.allUsers = [...response.data];
      })
      .catch((error: AxiosError<{ message: string }, unknown>) => {
        throw new Error(
          error?.response?.data?.message ?? "Failed to fetch users"
        );
      });
  }

  async fetchMyConnections() {
    const userId = sessionStorage.getItem("userId");
    this.isConnectionsLoading = true;
    try {
      // Call the API to fetch user connections data

      const response = await axios.get(
        `${BASE_URL}/networking/userconnections`,
        {
          params: {
            uid: userId,
          },
        }
      );

      const myConnections = response.data?.myConnections ?? [];

      await this.fetchAllUsers();

      const connectedUsers = this.allUsers.filter((user) =>
        myConnections.includes(user.uid)
      );
      this.myConnections = connectedUsers;
      this.isConnectionsLoading = false;
    } catch (error) {
      console.error("Error fetching user connections:", error);
      this.isConnectionsLoading = false;
    }
  }
}
