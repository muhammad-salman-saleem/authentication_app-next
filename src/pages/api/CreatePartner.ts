import type { NextApiRequest, NextApiResponse } from "next";
import Partner from "../../models/Partners";
import SignupModel from "../../models/Signup";
import sendConfirmationEmail from "./sendConfirmationEmail";

type Data = {
  status: number;
  message: string;
  data?: any;
};

export default async function CreatePartner(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { userId } = req.query;
    debugger;
    const {
      avatarImage,
      firstName,
      lastName,
      mobile,
      email,
      password,
      plan_access,
      plan_creation,
    } = req.body;
    try {
      if (
        !avatarImage ||
        !firstName ||
        !lastName ||
        !mobile ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({ status: 0, message: "All fields are required" });
      }

  
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
      const admin = await SignupModel.findOne({ _id: userId });
      if (!admin) {
        return res.status(404).json({ status: 0, message: "Admin not found" });
      }
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const newPartner = await Partner.create({
        firstName,
        lastName,
        mobile,
        email,
        password,
        user_verification_code: verificationCode,
        is_verified: false,
        isPartner: true,
        isAdmin: false,
        isDeveloper: false,
        avatarImage,
        admin_id: admin._id,
        plan_access,
        plan_creation,
      });

      const unhashedPassword = password; 
      sendConfirmationEmail(newPartner.email, verificationCode,unhashedPassword)
        .then(() => {
          console.log("Confirmation email sent");
        })
        .catch((error) => {
          console.error("Error sending confirmation email:", error);
        });

      if (newPartner) {
        console.log("new admin", newPartner);
        return res.status(200).json({
          status: 1,
          message:
            "Request has been successfully submitted and OTP sent to sign-up email. Please check junk/spam if not received.",
          data: newPartner,
        });
      } else {
        return res
          .status(500)
          .json({ status: 0, message: "Failed to create a new user" });
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: 0, message: "An error occurred during signup" });
    }
  } else {
    return res.status(405).json({ status: 0, message: "Method Not Allowed" });
  }
}
