import nodemailer from "nodemailer";

const sendConfirmationEmail = async (
  email: string,
  verificationCode: number,
  unhashedPassword:string
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
    html: `
        <p>Please confirm your email:</p>
        <p>Verification Code: ${verificationCode}</p>
        <p>Email: ${email}</p>
        <p>Password: ${unhashedPassword}</p>
        <a href="http://localhost:3000/components/ConfirmationEmail?email=${email}">
          <button
            style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer;"
          >
            Verify Email
          </button>
        </a>
      `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent");
  } catch (error) {
    console.error("Error sending confirmation email:", error);
  }
};

export default sendConfirmationEmail;
