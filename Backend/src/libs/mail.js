import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "../libs/api-error.js";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "BytePulese",
      link: "https://mailgen.js/",
    },
  });
  const emailHtml = mailGenerator.generate(options.mailGenContent);
  const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.SENDGRID_SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SENDGRID_SMTP_USER, // must be "apikey"
      pass: process.env.SENDGRID_SMTP_PASS, // your SendGrid API key
    },
  });

  const mail = {
    from: "bytespulsedev@gmail.com", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: emailText, // plain text body
    html: emailHtml, // html body
  };

  try {
    transporter.sendMail(mail, (error, info) => {
      if (error) {
        console.log("Error:", error);
        throw new ApiError(500, error.message);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to BytePulse! We're very excited to have you on board.",
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

const forgotPasswordMailGenContent = (username, forgotPasswordUrl) => {
  return {
    body: {
      name: username,
      intro:
        "You have received this email because you have requested to forgot your password.",
      action: {
        instructions: "To reset your password, please click here:",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Forgot your password",
          link: forgotPasswordUrl,
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
  forgotPasswordMailGenContent,
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
