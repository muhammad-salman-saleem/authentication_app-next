import type { NextApiRequest, NextApiResponse } from "next";
import SignupModel from "../../models/Signup";
import sendConfirmationEmail from "./sendConfirmationEmail"

type Data = {
  status: number;
  message: string;
  data?: any;
};

export default async function SignupDeveloper(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const {
      avatarImage,
      firstName,
      lastName,
      occupation,
      mobile,
      email,
      password,
    } = req.body;

    try {
      if (
        !avatarImage ||
        !firstName ||
        !lastName ||
        !occupation ||
        !mobile ||
        !email ||
        !password
      ) {
        return res
          .status(400)
          .json({ status: 0, message: "All fields are required" });
      }

      const developerFind = await SignupModel.findOne({ email });
      if (developerFind) {
        return res
          .status(409)
          .json({ status: 0, message: "This email already exists" });
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);

      const newDeveloper = await SignupModel.create({
        firstName,
        lastName,
        occupation,
        mobile,
        email,
        password,
        user_verification_code: verificationCode,
        is_verified: false,
        isAdmin: false,
        isPartner:false,
        isDeveloper:true,
        avatarImage,
      });

      sendConfirmationEmail(newDeveloper.email, verificationCode)
        .then(() => {
          console.log("Confirmation email sent");
        })
        .catch((error) => {
          console.error("Error sending confirmation email:", error);
        });

      if (newDeveloper) {
        console.log("new admin", newDeveloper);
        return res.status(200).json({
          status: 1,
          message:
            "Request has been successfully submitted and OTP sent to sign-up email. Please check junk/spam if not received.",
          data: newDeveloper,
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
