import UserDetailsModel from "../models/userDetails";
import { UserDetails, NewUser } from "../types";
import { createStripeCustomer } from "../utils/stripe";

const getAllUsers = async (): Promise<UserDetails[]> => {
  try {
    return await UserDetailsModel.find({});
  } catch (error: unknown) {
    throw new Error("Unable to fetch users");
  }
};

const getUserByUid = async (uid: string): Promise<UserDetails | null> => {
  try {
    const response = await UserDetailsModel.findOne({ uid });
    return response;
  } catch (error: unknown) {
    throw new Error("Unable to fetch user");
  }
};

const addUser = async (uid: string, newUser: NewUser): Promise<UserDetails> => {
  try {
    const existingUserByEmail = await UserDetailsModel.findOne({
      email: newUser.email,
    });
    if (existingUserByEmail) {
      throw new Error("User with this email already exists");
    }
    const userDetailsWithUid = {
      ...newUser,
      uid: uid,
    };
    const userDetails = new UserDetailsModel(userDetailsWithUid);
    await userDetails.validate();
    await userDetails.save();

    return userDetails;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ValidationError") {
      throw new Error("Invalid user data");
    } else {
      throw new Error("Unable to add user");
    }
  }
};

const updateUser = async (
  uid: string,
  updatedUserData: Partial<UserDetails>
): Promise<UserDetails | null> => {
  try {
    if (!updatedUserData.email && !updatedUserData.uid) {
      throw new Error("Either 'email' or 'uid' must be provided");
    }

    const existingUser = await UserDetailsModel.findOne({ uid: uid });
    if (!existingUser) {
      throw new Error("User not found");
    }

    Object.assign(existingUser, updatedUserData);

    await existingUser.validate();

    const updatedUser = await existingUser.save();

    return updatedUser;
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === "ValidationError") {
      throw new Error("Invalid user data");
    } else {
      throw new Error("Unable to update user due to internal server error");
    }
  }
};

const deleteUserById = async (_id: string): Promise<void> => {
  try {
    const existingUser = await UserDetailsModel.findOneAndDelete({ _id });
    if (!existingUser) {
      throw new Error("User not found");
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getUserByEmail = async (email: string): Promise<UserDetails | null> => {
  try {
    return await UserDetailsModel.findOne({ email });
  } catch (error: unknown) {
    throw new Error("Unable to fetch user");
  }
};

/**
 * Retrieves an existing Stripe customer ID for a specified user based on their unique identifier (UID).
 * If the user does not have a Stripe customer ID, a new Stripe customer is created using the user's email and
 * first name, and the new Stripe customer ID is subsequently stored in the user's profile in the database.
 *
 * @param uid - The unique identifier for the user whose Stripe customer ID is being requested.
 * @returns A promise that resolves to the Stripe customer ID on success, or null if the user does not exist
 *          or a new Stripe customer ID could not be created.
 * @throws An error if there is an issue retrieving the user's details from the database or if creating a
 *        new Stripe customer fails.
 */
const createOrFetchUserStripeCustomerId = async (
  uid: string
): Promise<string | null> => {
  try {
    const user = await UserDetailsModel.findOne({ uid });
    if (user?.stripeCustomerId) {
      return user.stripeCustomerId;
    } else {
      if (user) {
        return await createStripeCustomer(user?.email, user?.firstName)
          .then(async (customer) => {
            const updatedUser = {
              uid: user.uid,
              email: user.email,
              stripeCustomerId: customer.id,
            };
            await updateUser(uid, updatedUser);
            return customer.id;
          })
          .catch(() => {
            return null;
          });
      } else {
        return null;
      }
    }
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export default {
  getAllUsers,
  getUserByUid,
  getUserByEmail,
  addUser,
  updateUser,
  deleteUserById,
  createOrFetchUserStripeCustomerId,
};
