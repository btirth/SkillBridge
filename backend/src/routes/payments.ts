import express, { Request, Response } from "express";
import paymentsService from "../services/paymentsService";

const router = express.Router();

/**
 * Saves a payment card to Stripe.
 * @param req - The request object, expecting a paymentMethodId and userId in the body.
 * @param res - The response object.
 * @returns The result of the save operation as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.post("/save-card", async (req: Request, res: Response) => {
  try {
    const { paymentMethodId, userId } = req.body;
    const response = await paymentsService.saveCardToStripe(
      paymentMethodId,
      userId
    );
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Fetches saved cards for a user from Stripe.
 * @param req - The request object, expecting a userId parameter in the route.
 * @param res - The response object.
 * @returns An array of saved cards as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.get(
  "/fetch-saved-cards/:userId",
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const cards = await paymentsService.fetchSavedCardsFromStripe(userId);
      return res.status(201).json(cards);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Deletes a saved card from Stripe for a user.
 * @param req - The request object, expecting userId and paymentMethodId parameters in the route.
 * @param res - The response object.
 * @returns The result of the delete operation as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.delete(
  "/delete-card/:userId/:paymentMethodId",
  async (req: Request, res: Response) => {
    try {
      const { userId, paymentMethodId } = req.params;
      const response = await paymentsService.deleteSavedCardFromStripe(
        userId,
        paymentMethodId
      );
      return res.status(201).json(response);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }
);

/**
 * Processes a payment using Stripe.
 * @param req - The request object, expecting userId, paymentMethodId, amount, and description in the body.
 * @param res - The response object.
 * @returns The result of the payment operation as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.post("/pay", async (req: Request, res: Response) => {
  try {
    const { userId, paymentMethodId, amount, description } = req.body;
    const response = await paymentsService.payUsingStripe({
      userId,
      paymentMethodId,
      amount,
      description,
    });
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * Fetches transactions for a user.
 * @param req - The request object, expecting a userId parameter in the route and optional query parameters for pagination (page, limit).
 * @param res - The response object.
 * @returns A paginated list of transactions as a JSON object with a 201 status code for success, or an error message with a 500 status code.
 */
router.get("/transactions/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const response = await paymentsService.fetchTransactions(
      userId,
      page,
      limit
    );
    return res.status(201).json(response);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
