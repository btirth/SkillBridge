/**
 * @author Drashti Navadiya (B00948838)
 */
import express, { Request, Response } from "express";
import userService from "../services/userDetailsService";
import UserDetailsModel from "../models/userDetails";

const router = express.Router();

/**
 * @param {Request} req - The request object containing user data.
 * @param {Response} res - The response object for sending back data or errors.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @param {Request} req - The request object containing the user ID.
 * @param {Response} res - The response object for sending back data or errors.
 */
router.get("/:uid", async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;
    const user = await userService.getUserByUid(uid);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @param {Request} req - The request object containing user data to be added.
 * @param {Response} res - The response object for sending back data or errors.
 */
router.post("/add", async (req: Request, res: Response) => {
  try {
    const {
      uid,
      email,
      firstName,
      lastName,
      image,
      dob,
      profession,
      companyName,
    } = req.body;

    const existingEmailUser = await UserDetailsModel.findOne({ email });
    if (existingEmailUser) {
      return res
        .status(409)
        .json({ message: "Account with this email already exists" });
    }

    const existingUidUser = await UserDetailsModel.findOne({ uid });
    if (existingUidUser) {
      return res
        .status(409)
        .json({ message: "Account with this uid already exists" });
    }

    const newUser = new UserDetailsModel({
      uid,
      email,
      firstName,
      lastName,
      image,
      dob,
      profession,
      companyName,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});


/**
 * @param {Request} req - The request object containing the user ID to be updated.
 * @param {Response} res - The response object for sending back data or errors.
 */
router.put("/:uid", async (req: Request, res: Response) => {
  try {
    const uid = req.params.uid;
    const updatedUserData = req.body;
    if (!updatedUserData.email && !updatedUserData.uid) {
      res
        .status(400)
        .json({ error: "Either 'email' or 'id' must be provided" });
      return;
    }
    const updatedUser = await userService.updateUser(uid, updatedUserData);
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res
      .status(201)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @param {Request} req - The request object containing the user ID to be deleted.
 * @param {Response} res - The response object for sending back data or errors.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const _id = req.params.id;
    await userService.deleteUserById(_id);
    res.sendStatus(204);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
