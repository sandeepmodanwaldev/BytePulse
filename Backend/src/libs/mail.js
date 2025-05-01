import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "../libs/api-error";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "BytePulese",
      link: "https://mailgen.js/",
    },
  });
  const emailHtml = mailGenerator.generate(option.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(option.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.BytePulse@example.com", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: emailText, // plain text body
    html: emailHtml, // html body
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: {
        color: "#999999",
        text: "Welcome to BytePulse! We're very excited to have you on board.",
      },
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Verify Account",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const resetPasswordMailGenContent = (username, resetPasswordUrl) => {
  return {
    body: {
      name: username,
      intro:
        "You have received this email because you have requested to reset your password.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset your password",
          link: resetPasswordUrl,
        },
      },
      outro:
        "This is system generated email. Please do not reply to this email.",
    },
  };
};

export {
  sendMail,
  emailVerificationMailGenContent,
  resetPasswordMailGenContent,
};

// import { sendMail, emailVerificationMailGenContent } from "./mail.js";

// const email = "user@example.com";
// const subject = "Verify your email";
// const username = "JohnDoe";
// const verificationLink = "https://yourdomain.com/verify?token=xyz";

// const mailGenContent = emailVerificationMailGenContent(username, verificationLink);

// await sendMail({
//   user.email,
//   subject,
//   mailGenContent,
// });
