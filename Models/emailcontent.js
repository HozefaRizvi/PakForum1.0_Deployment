// emailContent.js
const generateEmailContent = (otp) => {
  return `
      <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .email-header {
      background-color: #007bff;
      padding: 20px;
      text-align: center;
      color: #fff;
      font-size: 24px;
      font-weight: bold;
    }

    .email-body {
      padding: 30px;
      line-height: 1.6;
    }

    .otp-box {
      background-color: #f1f1f1;
      padding: 15px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
      letter-spacing: 4px;
      border-radius: 5px;
      margin: 20px 0;
    }

    .email-footer {
      padding: 20px;
      background-color: #f4f4f4;
      text-align: center;
      font-size: 12px;
      color: #777;
    }

    a {
      color: #007bff;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .button {
      background-color: #007bff;
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      text-decoration: none;
      display: inline-block;
      margin-top: 20px;
    }

    .button:hover {
      background-color: #0056b3;
    }

    @media only screen and (max-width: 600px) {
      .email-body {
        padding: 20px;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="email-header">
      Pak Forum - OTP Verification
    </div>

    <div class="email-body">
      <h1>Confirm Your Email Address</h1>
      <p>Dear User,</p>
      <p>Thank you for registering with Pak Forum. To complete your email verification process, please use the OTP code provided below:</p>

      <div class="otp-box">${otp}</div>

      <p>If you did not request this code, please ignore this email. The code will expire in 10 minutes.</p>

      <a href="#" class="button">Verify Email</a>

      <p>For further assistance, feel free to contact our support team at any time.</p>

      <p>Best regards,<br>Pak Forum Team</p>
    </div>

    <div class="email-footer">
      <p>Pak Forum | Support: support@pakforum.com | Phone: +92-XXX-XXXXXXX</p>
      <p>123 Street, City, Country</p>
      <p>&copy; 2024 Pak Forum. All rights reserved.</p>
    </div>
  </div>
</body>

</html>

    `;
};

module.exports = generateEmailContent; // Export the function
