const nodemailer = require("nodemailer");

// Create transporter (switch between Ethereal for dev and SMTP for prod)
const createTransporter = async () => {
  // Check if we have real SMTP credentials
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Real SMTP transporter (Gmail, SendGrid, etc.) - WORKS FOR DEMO!
    console.log("Using REAL SMTP service:", process.env.EMAIL_HOST || "smtp.gmail.com");
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for port 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Fallback to Ethereal if no SMTP credentials
    console.log("No SMTP credentials found, using Ethereal for demo");
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "abe.kohler59@ethereal.email",
        pass: "8Bft1DC6qX7319GZ1f",
      },
    });
    return transporter;
  }
};


// Send email
const send = async (info) => {
  try {
    const transporter = await createTransporter();
    
    const result = await transporter.sendMail(info);

    console.log("Message sent: %s", result.messageId);

    if (process.env.NODE_ENV !== "production") {
      // For dev/testing → show preview URL
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
    }

    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

// Email processor
const emailProcessor = async ({ email, pin, type, verificationLink = "" }) => {
  let info = {};
  switch (type) {
    case "request-new-password":
      info = {
        from: '"CMR Company" <no-reply@cmr.com>',
        to: email,
        subject: "Password reset Pin",
        text: `Here is your password reset pin: ${pin}. This pin will expire in 1 day.`,
        html: `<b>Hello</b><br>
          Here is your pin: <b>${pin}</b><br>
          This pin will expire in 1 day.`,
      };
      break;

    case "update-password-success":
      info = {
        from: '"CMR Company" <no-reply@cmr.com>',
        to: email,
        subject: "Password updated",
        text: "Your new password has been updated.",
        html: `<b>Hello</b><br>
          <p>Your new password has been updated.</p>`,
      };
      break;

    case "new-user-confirmation-required":
      const decodedLink = decodeURIComponent(verificationLink);
      info = {
        from: '"CMR Company" <no-reply@cmr.com>',
        to: email,
        subject: "Please verify your new user",
        text: `Please follow the link to verify your account before you can login: ${decodedLink}`,
        html: `<b>Hello</b><br>
          <p>Please follow the link to verify your account before you can login:</p>
          <p><a href="${decodedLink}">${decodedLink}</a></p>`,
      };
      break;

    default:
      return;
  }

  return await send(info);
};

module.exports = { emailProcessor };
