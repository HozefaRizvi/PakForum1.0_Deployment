const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const generateEmailContent = require('./emailcontent');
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, 
  },
});

async function sendVerificationEmail(email, otp) {
  try {
    const emailContent = generateEmailContent(otp);
    const mailResponse = await mailSender(
      email,
      "Verification Email from Pak Forum",
      emailContent
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});
module.exports = mongoose.model("OTP", otpSchema);