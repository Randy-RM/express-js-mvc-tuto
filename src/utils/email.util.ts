import nodemailer from "nodemailer";
import { authBaseURI, activateAccountURI, resetPasswordURI } from "../config/paths.config";

function createTransport() {
  if (process.env.NODE_ENV === "development") {
    return nodemailer.createTransport({
      host: "localhost",
      port: 1025,
    });
  }

  return nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });
}

export async function sendAccountActivationEmail(
  email: string,
  uniqueString: string,
  apiHostDomain: string
): Promise<void> {
  const transport = createTransport();
  const sender = "MiniBlog My Company <info@mini-blog.org>";

  const mailOptions = {
    from: sender,
    to: email,
    subject: "Email confirmation",
    html: `Press <a href='http://${apiHostDomain}${authBaseURI}${activateAccountURI}/${uniqueString}'>Here</a> to verify your email.`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Confirmation email sent");
  } catch (error) {
    console.error("Confirmation email not sent", error);
  }
}

export async function sendPasswordRecoveryEmail(
  email: string,
  resetToken: string,
  apiHostDomain: string
): Promise<void> {
  const transport = createTransport();
  const sender = "MiniBlog My Company <info@mini-blog.org>";

  const mailOptions = {
    from: sender,
    to: email,
    subject: "Password recovery",
    html: `Press <a href='http://${apiHostDomain}${authBaseURI}${resetPasswordURI}/${resetToken}'>Here</a> to reset your password. This link expires in 1 hour.`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Recovery email sent");
  } catch (error) {
    console.error("Recovery email not sent", error);
  }
}
