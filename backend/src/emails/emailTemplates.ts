export const VERIFICATION_EMAIL_TEMPLATE = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      background-color: #f5f7f6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    "
  >
    <!-- Header -->
    <div
      style="
        background: linear-gradient(135deg, #34c27a, #0f5a2e);
        padding: 25px;
        text-align: center;
        border-radius: 8px 8px 0 0;
      "
    >
      <h1 style="color: white; margin: 0; font-size: 24px">
        Verify Your Email
      </h1>
    </div>

    <!-- Content -->
    <div
      style="
        background-color: white;
        padding: 25px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      "
    >
      <p style="color: #1a1a1a">Hello,</p>

      <p style="color: #6b7280">
        Thank you for signing up! Your verification code is:
      </p>

      <!-- Code Box -->
      <div style="text-align: center; margin: 30px 0">
        <span
          style="
            display: inline-block;
            padding: 15px 25px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            background-color: #f5f7f6;
            color: #0d3b1e;
            border-radius: 8px;
            border: 2px dashed #2fbf71;
          "
        >
          {verificationCode}
        </span>
      </div>

      <p style="color: #6b7280">
        Enter this code on the verification page to complete your registration.
      </p>

      <p style="color: #6b7280">
        This code will expire in
        <strong style="color: #0d3b1e">10 minutes</strong> for security reasons.
      </p>

      <p style="color: #6b7280">
        If you didn't create an account with us, please ignore this email.
      </p>

      <p style="color: #1a1a1a">
        Best regards,<br />
        <strong style="color: #2fbf71">Interno Team</strong>
      </p>
    </div>

    <!-- Footer -->
    <div
      style="
        text-align: center;
        margin-top: 20px;
        color: #6b7280;
        font-size: 12px;
      "
    >
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </body>
</html>
`;
