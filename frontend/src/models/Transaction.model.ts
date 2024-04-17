export interface Transaction {
  id: string;
  amount: number;
  userId: string;
  stripeTransactionId: string;
  paymentMethodId: string;
  description: string;
  createdAt: Date;
  cardLast4?: string;
}

export interface TransactionResponse {
  data: Transaction[];
  page: number;
  pages: number;
  total: number;
}

export interface TransactionParams {
  page: number;
  limit: number;
  totalPages: number;
}
