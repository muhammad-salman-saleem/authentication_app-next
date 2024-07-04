import type { NextApiRequest, NextApiResponse } from "next";
import Partner from "../../models/Partners";
type Data = {
  status: number;
  message: string;
  data?: any;
};
export default async function GetSinglePartnerData(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const userData = await Partner.findOne({ _id:userId });

      if (userData) {
        res.status(200).json(userData);
      } else {
        return res.status(404).json({ status: 0, message: "User Note Found" });
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      return res.redirect("/verification-failure");
    }
  } else {
    return res.status(405).json({ status: 0, message: "Method Not Allowed" });
  }
}
