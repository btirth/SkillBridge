import UserDetailsModel from "../models/userDetails";
import UserConnectionsModel from "../models/userconnection";
import { UserConnections, UserDetails } from "../types";

const getAllUsers = async (pageNumber: number): Promise<{ users: UserDetails[]; totalCount: number }> => {
    const batchSize = 12; // Number of users per batch
    const skip = (pageNumber - 1) * batchSize; // Calculate the number of documents to skip

    try {
        const users = await UserDetailsModel.find({}).skip(skip).limit(batchSize);
        const totalCount = await UserDetailsModel.countDocuments();
        return { users, totalCount };
    } catch (error: unknown) {
        throw new Error("Unable to fetch users");
    }
};

const getConnectiondetails = async (uid: string): Promise<UserConnections> => {
    try {
        // Find the user connections by UID
        let userConnections = await UserConnectionsModel.findOne({ uid });
        console.log("outside")
        // If user connections are not found, create a new object with uid and save it
        if (!userConnections) {
            console.log("inside")
            // Create a new user connections object
            userConnections = new UserConnectionsModel({ uid });
            // Save the new user connections object to the database
            await userConnections.save();
        }

        // Return the user connections
        return userConnections;
    } catch (error: unknown) {
        // Handle errors
        throw new Error("Unable to fetch user connections");
    }
};

const sendConnectionRequest = async (userUid: string, loggedInUserId: string): Promise<void> => {
    try {
        // Find the user connections for the logged-in user
        let loggedInUserConnections = await UserConnectionsModel.findOne({ uid: loggedInUserId });
        if (!loggedInUserConnections) {
            loggedInUserConnections = new UserConnectionsModel({ uid: loggedInUserId });
        }

        // Find the user connections for the user to send the request to
        let userConnections = await UserConnectionsModel.findOne({ uid: userUid });
        if (!userConnections) {
            userConnections = new UserConnectionsModel({ uid: userUid });
        }

        // Add userUid to the requestSent of the logged-in user and loggedInUserId to the requestReceived of the user
        loggedInUserConnections.requestSent.push(userUid);
        userConnections.requestReceived.push(loggedInUserId);

        // Save the changes to the database
        await loggedInUserConnections.save();
        await userConnections.save();
    } catch (error: unknown) {
        throw new Error("Unable to send connection request");
    }
};

const handleRequestSent = async (userUid: string, loggedInUserId: string): Promise<void> => {
    try {
        // Find the user connections for the logged-in user
        const loggedInUserConnections = await UserConnectionsModel.findOne({ uid: loggedInUserId });
        if (!loggedInUserConnections) {
            throw new Error("User connections not found for the logged-in user");
        }

        // Find the user connections for the user to handle the request
        const userConnections = await UserConnectionsModel.findOne({ uid: userUid });
        if (!userConnections) {
            throw new Error("User connections not found for the specified user");
        }

        // Remove userUid from the requestSent of the logged-in user
        loggedInUserConnections.requestSent = loggedInUserConnections.requestSent.filter(uid => uid !== userUid);

        // Remove loggedInUserId from the requestReceived of the user
        userConnections.requestReceived = userConnections.requestReceived.filter(uid => uid !== loggedInUserId);

        // Save the changes to the database
        await loggedInUserConnections.save();
        await userConnections.save();
    } catch (error: unknown) {
        throw new Error("Unable to handle request sent");
    }
};

const handleRequestReceivedAccept = async (userUid: string, loggedInUserId: string): Promise<void> => {
    try {
        // Find the user connections for the logged-in user
        const loggedInUserConnections = await UserConnectionsModel.findOne({ uid: loggedInUserId });
        if (!loggedInUserConnections) {
            throw new Error("User connections not found for the logged-in user");
        }

        // Find the user connections for the user to handle the request
        const userConnections = await UserConnectionsModel.findOne({ uid: userUid });
        if (!userConnections) {
            throw new Error("User connections not found for the specified user");
        }

        // Remove userUid from the requestReceived of the logged-in user
        loggedInUserConnections.requestReceived = loggedInUserConnections.requestReceived.filter(uid => uid !== userUid);

        // Add userUid to the myConnections of the logged-in user
        loggedInUserConnections.myConnections.push(userUid);

        // Remove loggedInUserId from the requestSent of the user
        userConnections.requestSent = userConnections.requestSent.filter(uid => uid !== loggedInUserId);

        // Add loggedInUserId to the myConnections of the user
        userConnections.myConnections.push(loggedInUserId);

        // Save the changes to the database
        await loggedInUserConnections.save();
        await userConnections.save();
    } catch (error: unknown) {
        throw new Error("Unable to handle request received");
    }
};

const handleRequestReceivedReject = async (userUid: string, loggedInUserId: string): Promise<void> => {
    try {
        // Find the user connections for the logged-in user
        const loggedInUserConnections = await UserConnectionsModel.findOne({ uid: loggedInUserId });
        if (!loggedInUserConnections) {
            throw new Error("User connections not found for the logged-in user");
        }

        // Find the user connections for the user to handle the request
        const userConnections = await UserConnectionsModel.findOne({ uid: userUid });
        if (!userConnections) {
            throw new Error("User connections not found for the specified user");
        }

        // Remove userUid from the requestReceived of the logged-in user
        loggedInUserConnections.requestReceived = loggedInUserConnections.requestReceived.filter(uid => uid !== userUid);

        // Remove loggedInUserId from the requestSent of the user
        userConnections.requestSent = userConnections.requestSent.filter(uid => uid !== loggedInUserId);

        // Save the changes to the database
        await loggedInUserConnections.save();
        await userConnections.save();
    } catch (error: unknown) {
        throw new Error("Unable to handle request received");
    }
};

const handleMyConnection = async (userUid: string, loggedInUserId: string): Promise<void> => {
    try {
        // Find the user connections for the logged-in user
        const loggedInUserConnections = await UserConnectionsModel.findOne({ uid: loggedInUserId });
        if (!loggedInUserConnections) {
            throw new Error("User connections not found for the logged-in user");
        }

        // Find the user connections for the user to handle the connection
        const userConnections = await UserConnectionsModel.findOne({ uid: userUid });
        if (!userConnections) {
            throw new Error("User connections not found for the specified user");
        }

        // Remove userUid from the myConnections of the logged-in user
        loggedInUserConnections.myConnections = loggedInUserConnections.myConnections.filter(uid => uid !== userUid);

        // Remove loggedInUserId from the myConnections of the user
        userConnections.myConnections = userConnections.myConnections.filter(uid => uid !== loggedInUserId);

        // Save the changes to the database
        await loggedInUserConnections.save();
        await userConnections.save();
    } catch (error: unknown) {
        throw new Error("Unable to handle my connection");
    }
}

export default {
    getAllUsers,
    getConnectiondetails,
    sendConnectionRequest,
    handleRequestSent,
    handleRequestReceivedAccept,
    handleRequestReceivedReject ,
    handleMyConnection
};
