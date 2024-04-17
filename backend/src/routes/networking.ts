import express, { Request, Response } from "express";
import networkingService from "../services/networkingService";

const networkingrouter = express.Router();

networkingrouter.get("/", async (req: Request, res: Response) => {
  try {
      const pageNumber = parseInt(req.query.pageNumber as string) || 1;
      const users = await networkingService.getAllUsers(pageNumber);
      res.json(users);
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
});

networkingrouter.get("/userconnections", async (req: Request, res: Response) => {
  try {
    let uid = req.query.uid; // Retrieve uid from query parameters
    if (!uid) {
      return res.status(400).json({ error: "uid parameter is required" });
    }
    uid = uid.toString(); 
    console.log(uid)
    const userConnections = await networkingService.getConnectiondetails(uid);
    console.log(userConnections)
    res.json(userConnections);
    return
  } catch (error: any) {
    return res.status(500).json({ error: error.message }); // Return an error response
  }
});


networkingrouter.post("/sendConnectionRequest", async (req: Request, res: Response) => {
  try {
    const { userUid, loggedInUserId } = req.body;

    // Check if userUid and loggedInUserId are provided
    if (!userUid || !loggedInUserId) {
      return res.status(400).json({ error: "userUid and loggedInUserId are required" });
    }

    // Call networking service to send connection request
    await networkingService.sendConnectionRequest(userUid, loggedInUserId);

    res.status(200).json({ message: "Connection request sent successfully" });
    return
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

networkingrouter.post("/handleRequestSent", async (req: Request, res: Response) => {
  try {
    const { userUid, loggedInUserId } = req.body;

    // Check if userUid and loggedInUserId are provided
    if (!userUid || !loggedInUserId) {
      return res.status(400).json({ error: "userUid and loggedInUserId are required" });
    }

    // Call networking service to handle request sent
    await networkingService.handleRequestSent(userUid, loggedInUserId);

    res.status(200).json({ message: "Request sent handled successfully" });
    return;
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

networkingrouter.post("/handleRequestReceivedAccept", async (req: Request, res: Response) => {
  try {
    const { userUid, loggedInUserId } = req.body;

    // Check if userUid and loggedInUserId are provided
    if (!userUid || !loggedInUserId) {
      return res.status(400).json({ error: "userUid and loggedInUserId are required" });
    }

    // Call networking service to handle request received
    await networkingService.handleRequestReceivedAccept(userUid, loggedInUserId);

    res.status(200).json({ message: "Request received handled successfully" });
    return;
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

networkingrouter.post("/handleRequestReceivedReject", async (req: Request, res: Response) => {
  try {
    const { userUid, loggedInUserId } = req.body;
    console.log(userUid , loggedInUserId)
    // Check if userUid and loggedInUserId are provided
    if (!userUid || !loggedInUserId) {
      return res.status(400).json({ error: "userUid and loggedInUserId are required" });
    }

    // Call networking service to handle request received
    await networkingService.handleRequestReceivedReject(userUid, loggedInUserId);

    res.status(200).json({ message: "Request received handled successfully" });
    return;
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

networkingrouter.post("/handleMyConnection", async (req: Request, res: Response) => {
  try {
    const { userUid, loggedInUserId } = req.body;

    // Check if userUid and loggedInUserId are provided
    if (!userUid || !loggedInUserId) {
      return res.status(400).json({ error: "userUid and loggedInUserId are required" });
    }

    // Call networking service to handle my connection
    await networkingService.handleMyConnection(userUid, loggedInUserId);

    res.status(200).json({ message: "My connection handled successfully" });
    return;
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default networkingrouter