import type { NextApiRequest, NextApiResponse } from "next";
import SignupModel from "../../models/Signup";
// import Partner from "../../models/Partners";
type Data = {
  status: number;
  message: string;
  data?: any;
};
export default async function GetUserData(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const userData = await SignupModel.findOne({ _id:userId });

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

// import type { NextApiRequest, NextApiResponse } from "next";
// import SignupModel from "../../models/Signup";
// import Partner from "../../models/Partners";

// type Data = {
//   status: number;
//   message: string;
//   data?: any;
// };

// export default async function GetUserData(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>
// ) {
//   if (req.method === "GET") {
//     const { userId } = req.query;

//     try {
//       const [partnerData, signupData] = await Promise.all([
//         Partner.findOne({ _id: userId }),
//         SignupModel.findOne({ _id: userId })
//       ]);

//       if (partnerData || signupData) {
//         const userData:any = { partner: partnerData, signup: signupData };
//         res.status(200).json(userData);
//       } else {
//         return res.status(404).json({ status: 0, message: "User Not Found" });
//       }
//     } catch (error: any) {
//       console.error("Error:", error.message);
//       return res.redirect("/verification-failure");
//     }
//   } else {
//     return res.status(405).json({ status: 0, message: "Method Not Allowed" });
//   }
// }
