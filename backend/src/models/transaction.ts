import { Transaction } from "./../types";
import { Schema, model } from "mongoose";

const transactionsSchema = new Schema<Transaction>({
  id: { type: String, required: true },
  amount: { type: Number, required: true },
  userId: { type: String, required: true },
  paymentMethodId: { type: String },
  stripeTransactionId: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const TransactionModel = model<Transaction>("Transactions", transactionsSchema);

export default TransactionModel;
