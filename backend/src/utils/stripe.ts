import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51OzWAsCze0fcYUhcxAo4PRg7u0pz00TPy5xY5dYMiD8nPyDS1hHmkRa6gQiiRvNVeo2z9jZ8BZlweH5oPUTXB9Wy00PHapT0VL",
  {
    apiVersion: "2023-10-16",
  }
);

/**
 * Creates a new customer in Stripe.
 *
 * This function creates a new Stripe customer with the provided email address and, optionally, the name of the customer.
 *
 * @param email - The email address of the customer to be created in Stripe.
 * @param name - The optional name of the customer. This parameter can be omitted if the name is not available.
 * @returns A promise that resolves to the Stripe customer object.
 * @throws Will throw an error if the Stripe API call fails.
 */
export const createStripeCustomer = async (email: string, name?: string) => {
  const customer = await stripe.customers.create({
    email,
    name,
  });
  return customer;
};

export default stripe;
