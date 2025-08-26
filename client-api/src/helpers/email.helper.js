const nodemailer = require("nodemailer");

// Send email using a fresh Ethereal account each time (for dev/testing)
const send = async (info) => {
  try {
    // Create a test account on the fly
    const testAccount = await nodemailer.createTestAccount();

    // Create transporter with that test account
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send mail with defined transport object
    let result = await transporter.sendMail(info);

    console.log("Message sent: %s", result.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));

    return result;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

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
      // Show a human-readable link in the email
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

  // Always await send!
  return await send(info);
};

module.exports = { emailProcessor };
