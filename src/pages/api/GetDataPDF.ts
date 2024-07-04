import type { NextApiRequest, NextApiResponse } from "next";
import SignupModel from "../../models/Signup";
import SendPDFemail from "./SendPDFemail";
import PDFDocument from "pdfkit";
import fs from "fs";

type Data = {
  status: number;
  message: string;
  data?: any;
};

export default async function GetDataPDF(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "GET") {
    const { userId } = req.query;

    try {
      const userData = await SignupModel.findOne({ _id: userId });

      if (userData) {
        const userEmail = userData.email;
        const pdfPath = "user_data.pdf";

        const userPassword = userData.mobile.toString().substr(-4);
        const options = {
          userPassword: userPassword,
        };

        generatePDF(userData, pdfPath, () => {
          SendPDFemail(userEmail, pdfPath,);
          fs.unlinkSync(pdfPath);
        }, options);


        res.status(200).json(userData);
      } else {
        return res.status(404).json({ status: 0, message: "User Not Found" });
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

async function generatePDF(
  userData: any,
  outputPath: string,
  callback: () => void,
  options: any,
) {
  // const options = {
  //   userPassword: "123",
  // };
  const doc = new PDFDocument(options);

  doc.pipe(fs.createWriteStream(outputPath));

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Name: ${userData.firstName} ${userData.lastName}`);
  doc.font("Helvetica-Bold").fontSize(12).text(`Email: ${userData.email}`);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Occupation: ${userData.occupation}`);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Mobile No: 0${userData.mobile}`);
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text(`Verification Code: ${userData.user_verification_code}`);

  doc.end();

  callback();
}
