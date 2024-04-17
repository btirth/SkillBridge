import { ObjectId } from "mongodb";
import stripe from "../utils/stripe";
import userService from "../services/userDetailsService";
import { Transaction } from "../types";
import TransactionModel from "../models/transaction";

/**
 * Saves a payment method to a user's Stripe customer account.
 *
 * @param paymentMethodId - The Stripe payment method ID to attach.
 * @param userId - The ID of the user to whom the payment method belongs.
 * @returns The Stripe payment method object after it has been attached.
 * @throws Throws an error if the payment method could not be attached, including if the user ID is invalid.
 */
const saveCardToStripe = async (paymentMethodId: string, userId: string) => {
  const stripeCustomerId = await userService.createOrFetchUserStripeCustomerId(
    userId
  );
  if (stripeCustomerId) {
    return await stripe.paymentMethods
      .attach(paymentMethodId, {
        customer: stripeCustomerId.toString(),
      })
      .then((card) => {
        return card;
      })
      .catch((error: Error) => {
        const errorMessage: string = error.message || "Unexpected error";
        throw new Error(errorMessage);
      });
  } else {
    throw new Error("Invalid user id");
  }
};

/**
 * Retrieves all saved cards from a user's Stripe customer account.
 *
 * @param userId - The ID of the user whose saved cards are to be fetched.
 * @returns An array of Stripe payment method objects representing the saved cards.
 * @throws Throws an error if there was an issue fetching the saved cards or if the user ID is invalid.
 */
const fetchSavedCardsFromStripe = async (userId: string) => {
  const stripeCustomerId = await userService.createOrFetchUserStripeCustomerId(
    userId
  );
  if (stripeCustomerId) {
    return stripe.paymentMethods
      .list({
        customer: stripeCustomerId.toString(),
        type: "card",
      })
      .then((cards) => {
        return cards.data;
      })
      .catch((error: Error) => {
        const errorMessage: string = error.message || "Unexpected error";
        throw new Error(errorMessage);
      });
  } else {
    throw new Error("Invalid card details");
  }
};

/**
 * Deletes a saved card from a user's Stripe customer account.
 *
 * @param userId - The ID of the user whose card is to be deleted.
 * @param paymentMethodId - The Stripe payment method ID of the card to delete.
 * @returns The Stripe payment method object after it has been detached.
 * @throws Throws an error if the card could not be detached or if the user ID is invalid.
 */
const deleteSavedCardFromStripe = async (
  userId: string,
  paymentMethodId: string
) => {
  const stripeCustomerId = await userService.createOrFetchUserStripeCustomerId(
    userId
  );
  if (stripeCustomerId) {
    return stripe.paymentMethods
      .detach(paymentMethodId)
      .then((response) => {
        return response;
      })
      .catch((error: Error) => {
        const errorMessage: string = error.message || "Unexpected error";
        throw new Error(errorMessage);
      });
  } else {
    throw new Error("Invalid user id");
  }
};

/**
 * Processes a payment using Stripe.
 *
 * @param transaction - An object containing details of the transaction including userId, paymentMethodId, amount, and an optional description.
 * @returns A newly created transaction document containing transaction details along with the Stripe transaction ID.
 * @throws Throws an error if the payment could not be processed or if required parameters are missing.
 */
const payUsingStripe = async (transaction: Partial<Transaction>) => {
  const { paymentMethodId, userId, amount } = transaction;
  if (userId && amount) {
    const stripeCustomerId =
      await userService.createOrFetchUserStripeCustomerId(userId);
    if (stripeCustomerId && paymentMethodId) {
      const isCardAttached = await checkPaymentMethodAttachment(
        paymentMethodId
      );
      let newPaymentMethodId: string = paymentMethodId;
      if (!isCardAttached) {
        const paymentMethod = await stripe.paymentMethods.attach(
          paymentMethodId,
          {
            customer: stripeCustomerId.toString(),
          }
        );

        newPaymentMethodId = paymentMethod.id;
      }

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "cad",
          payment_method: newPaymentMethodId,
          customer: stripeCustomerId.toString(),
          confirm: true,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
          },
        });
        const newTransaction = new TransactionModel({
          ...transaction,
          id: new ObjectId(),
          stripeTransactionId: paymentIntent.id,
        });

        await newTransaction.save();
        return newTransaction;
      } catch (error: unknown) {
        const errorMessage: string =
          (error as Error).message || "Unexpected error";
        throw new Error(errorMessage);
      }
    } else {
      throw new Error("Invalid user id");
    }
  } else {
    throw new Error("Invalid request. Amount and userId required.");
  }
};

/**
 * Checks whether a Stripe payment method is already attached to a customer.
 *
 * @param paymentMethodId - The Stripe payment method ID to check.
 * @returns True if the payment method is attached to a customer; otherwise, false.
 * @throws Logs and returns false if there was an error during the retrieval.
 */
async function checkPaymentMethodAttachment(paymentMethodId: string) {
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    if (paymentMethod.customer) {
      console.log(
        `PaymentMethod is attached to customer: ${paymentMethod.customer}`
      );
      return true;
    } else {
      console.log("PaymentMethod is not attached to any customer.");
      return false;
    }
  } catch (error) {
    console.error("Error retrieving PaymentMethod:", error);
    return false;
  }
}

/**
 * Fetches a paginated list of transactions for a user.
 *
 * Used various solutions from this stackover discussion to paginate data: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js
 *
 * @param userId - The ID of the user whose transactions are to be fetched.
 * @param page - The page number of the transactions to fetch.
 * @param limit - The number of transactions to fetch per page.
 * @returns An object containing paginated transaction data, total number of transactions, current page, and total pages.
 * @throws Throws an error if transactions could not be fetched.
 */
const fetchTransactions = async (
  userId: string,
  page: number,
  limit: number
) => {
  try {
    const skip = (page - 1) * limit;

    const transactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await TransactionModel.countDocuments({ userId });
    return {
      data: transactions,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  } catch (error: unknown) {
    throw new Error("Unable to fetch transactions");
  }
};

export default {
  saveCardToStripe,
  fetchSavedCardsFromStripe,
  deleteSavedCardFromStripe,
  payUsingStripe,
  fetchTransactions,
};
