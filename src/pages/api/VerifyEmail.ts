import type { NextApiRequest, NextApiResponse } from "next";
import SignupModel from "../../models/Signup";
import Partner from "../../models/Partners";

type Data = {
  status: number;
  message: string;
  data?: any;
};

export default async function verifyEmail(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { email } = req.query;

    try {
      const admin = await SignupModel.findOneAndUpdate(
        { email },
        { is_verified: true }
      );

      if (admin) {
        return res.redirect("/");
      } else {
        const partner = await Partner.findOneAndUpdate(
          { email },
          { is_verified: true }
        );

        if (partner) {
          return res.redirect("/");
        } else {
          return res
            .status(500)
            .json({ status: 0, message: "Email not found" });
        }
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: 0, message: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ status: 0, message: "Method Not Allowed" });
  }
}

