import axios from "axios";
import { ConversationModel } from "../../models/message.model";
import { UserDetails } from "../../models/UserDetatils.model";
import { getUserIdFromSession } from "../../utils/helpers";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MESSAGE_URL = `${BASE_URL}/message`;

export const sendMessage = async (receiverId: string, message: string) => {
  const userId = getUserIdFromSession();

  const url = `${MESSAGE_URL}/${receiverId}`;
  return await axios.post(
    url,
    { message: message },
    { headers: { userId: userId } }
  );
};

export const getMessages = async (receiverId: string) => {
  const userId = getUserIdFromSession();

  const url = `${MESSAGE_URL}/${receiverId}`;
  return await axios.get(url, { headers: { userId: userId } });
};

export const getConversations = async () => {
  const userId = getUserIdFromSession();

  const url = `${BASE_URL}/networking/userconnections`;
  try {
    const response = await axios.get(url, { params: { uid: userId } });
    const userConnections = response.data.myConnections as string[];

    const conversationsPromises = userConnections.map(
      async (connectionId): Promise<ConversationModel> => {
        const userDetailsResponse = await axios.get<UserDetails>(
          `${BASE_URL}/userDetails/${connectionId}`
        );
        const userDetails = userDetailsResponse.data;
        return {
          receiverId: connectionId,
          recieverName: userDetails.firstName + " " + userDetails.lastName,
        };
      }
    );

    const conversations = await Promise.all(conversationsPromises);
    return conversations;
  } catch (error) {
    console.error("Failed to get conversations:", error);
    return [];
  }
};
