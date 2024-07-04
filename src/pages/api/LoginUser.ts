// import type { NextApiRequest, NextApiResponse } from "next";
// import SignupModel from "../../models/Signup";
// import bcrypt from "bcrypt";

// type Data = {
//   status: number;
//   message: string;
//   data?: any;
// };

// export default async function LoginUser(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method === "POST") {
//     try {
//       const { email, password } = req.body;

//       if (!password) {
//         return res
//           .status(400)
//           .json({ status: 0, message: "Password field is required" });
//       }

//       const user = await SignupModel.findOne({ email });

//       if (!user) {
//         return res.status(400).json({ status: 0, message: "Email or password does not match!" });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return res
//           .status(400)
//           .json({ status: 0, message: "Email or password does not match!" });
//       }

//       if (!user.is_verified) {
//         return res
//           .status(400)
//           .json({ status: 0, message: "Email is not verified!" });
//       }

//       await user.generateAuthToken();
//       const updateUser = await SignupModel.findOneAndUpdate(
//         { _id: user._id },
//         { new: true }
//       );

//       return res.status(200).json({
//         status: 1,
//         message: "Login Successful.",
//         data: updateUser,
//       });
//     } catch (error: any) {
//       return res.status(400).json({ status: 0, message: error.message });
//     }
//   } else {
//     return res.status(405).json({ status: 0, message: "Method Not Allowed" });
//   }
// }
import type { NextApiRequest, NextApiResponse } from "next";
import Partner from "../../models/Partners";
import SignupModel from "../../models/Signup";
import bcrypt from "bcrypt";

type Data = {
  status: number;
  message: string;
  data?: any;
};

export default async function LoginUser(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;

      if (!password) {
        return res
          .status(400)
          .json({ status: 0, message: "Password field is required" });
      }

      const [partner, signupUser] = await Promise.all([
        Partner.findOne({ email }),
        SignupModel.findOne({ email })
      ]);

      if (!partner && !signupUser) {
        return res
          .status(400)
          .json({ status: 0, message: "Email or password does not match!" });
      }

      const isMatch = await bcrypt.compare(
        password,
        partner?.password || signupUser?.password
      );

      if (!isMatch) {
        return res
          .status(400)
          .json({ status: 0, message: "Email or password does not match!" });
      }

      const matchedUser = partner || signupUser;

      if (!matchedUser.is_verified) {
        return res
          .status(400)
          .json({ status: 0, message: "Email is not verified!" });
      }

      await matchedUser.generateAuthToken();

      return res.status(200).json({
        status: 1,
        message: "Login Successful.",
        data: {
          user: matchedUser,
          userModel: partner ? "Partner" : "Signup"
        },
      });
    } catch (error: any) {
      return res.status(400).json({ status: 0, message: error.message });
    }
  } else {
    return res.status(405).json({ status: 0, message: "Method Not Allowed" });
  }
}
