
import nodemailer from "nodemailer";

const SendPDFemail = async (
  email: string,
  pdfPath: string,
): Promise<void> => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "msalman1221998@gmail.com",
      pass: "cqfhodkkiswhwgyj",
    },
  });

  const mailOptions = {
    from: "msalman1221998@gmail.com",
    to: email,
    subject: "Email Confirmation",
    text: "Please find attached PDF file",
    html:`
    <p>Please Enter Phone no Last 4 digit PDF Password </p>
    `,
    attachments: [
      {
        filename: "user_data.pdf",
        path: pdfPath,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

export default SendPDFemail;
