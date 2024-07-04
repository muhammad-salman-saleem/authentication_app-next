import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

interface Price {
  unit_amount: number | null;
  currency: string;
}

interface ProductData {
  id: string;
  name: string;
  price: Price | string | number | null;
  images: string[];
  description: string | null;
}

type Data = {
  products: ProductData[];
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";

const stripeConfig: Stripe.StripeConfig = {
  apiVersion: "2022-11-15",
};

const stripe = new Stripe(stripeSecretKey, stripeConfig);
export default async function getProducts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const products = await stripe.products.list();
      // console.log("products",products.data)
      const productData: ProductData[] = products.data.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.default_price ?? null,
        description: product.description ?? null,
        images: product.images,
      }));

      const responseData: Data = {
        products: productData,
      };

      res.status(200).json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
