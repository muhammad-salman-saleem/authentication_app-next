import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";

const stripeConfig: Stripe.StripeConfig = {
  apiVersion: "2022-11-15",
};

const stripe = new Stripe(stripeSecretKey, stripeConfig);

export default async function createCheckoutSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { priceId } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: process.env.URL as string,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      res.status(200).json({ id: session.id });
    } catch (error: any) {
      console.error("Stripe Error:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
