import type { NextApiRequest, NextApiResponse } from "next";
import SignupModel from "../../models/Signup";
import Partner from "../../models/Partners";

type Data = {
  status: number;
  message: string;
  data?: any;
};
export default async function GetPartnersData(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const adminData = await SignupModel.findOne({ _id: userId });

      if (adminData && adminData.isAdmin === true) {
        const userData = await Partner.find();
        if (userData) {
          const responseData = await Promise.all(
            userData.map(async (user) => {
              const admin = await SignupModel.findOne({
                _id: user.admin_id,
              });

              return {
                ...user._doc,
                adminData: admin ? admin._doc : null,
              };
            })
          );

          res.status(200).json({
            status: 1,
            message: "User Data Found",
            data: responseData,
          });
        } else {
          return res
            .status(404)
            .json({ status: 0, message: "User Note Found" });
        }
      } else {
        return res
          .status(401)
          .json({ status: 0, message: "User Not Authorized" });
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      return res.redirect("/verification-failure");
    }
  } else if (req.method === "DELETE") {
    const { userId } = req.query;
    try {
      const deletedUser = await Partner.findOneAndDelete({ _id: userId });

      if (deletedUser) {
        res.status(200).json({
          status: 1,
          message: "User Deleted",
        });
      } else {
        return res.status(404).json({ status: 0, message: "User Not Found" });
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  } else if (req.method === "PATCH") {
    const { userId } = req.query;
    const { email, mobile } = req.body;

    try {
      const emailFind = await Promise.all([
        Partner.findOne({ email }),
        SignupModel.findOne({ email })
      ]);
      
      if (emailFind[0] || emailFind[1]) {
        return res
          .status(409)
          .json({ status: 0, message: "This email already exists" });
      }
      const mobileFind = await Promise.all([
        Partner.findOne({ mobile }),
        SignupModel.findOne({ mobile })
      ]);
      
      if (mobileFind[0] || mobileFind[1]) {
        return res
          .status(409)
          .json({ status: 0, message: "This Phone No already exists" });
      }
      const updatedUser = await Partner.findOneAndUpdate(
        { _id: userId },
        req.body,
        { new: true }
      );

      if (updatedUser) {
        res.status(200).json({
          status: 1,
          message: "User Updated",
          data: updatedUser,
        });
      } else {
        return res.status(404).json({ status: 0, message: "User Not Found" });
      }
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  } else {
    return res.status(405).json({ status: 0, message: "Method Not Allowed" });
  }
}
