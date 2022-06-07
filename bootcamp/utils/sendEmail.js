const nodemailer = require("nodemailer");
const envData = require('../envData');

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: envData.SMTP_HOST,
    port: envData.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: envData.SMTP_EMAIL, // generated ethereal user
      pass: envData.SMTP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const message = {
    from: `${envData.FROM_NAME} <${envData.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    // html: "<b>Hello world?</b>", // html body
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail; 