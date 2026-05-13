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
      margin: 0;
      padding: 0;
      background-color: #f6f2ff;
      font-family: Arial, Helvetica, sans-serif;
      color: #211a35;
    "
  >
    <div
      style="
        width: 100%;
        background:
          radial-gradient(circle at top left, rgba(139, 92, 246, 0.18), transparent 32%),
          radial-gradient(circle at bottom right, rgba(124, 58, 237, 0.14), transparent 35%),
          #f6f2ff;
        padding: 32px 16px;
        box-sizing: border-box;
      "
    >
      <div
        style="
          max-width: 620px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 18px 45px rgba(91, 64, 150, 0.16);
          border: 1px solid #e8ddff;
        "
      >
        <!-- Header -->
        <div
          style="
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 45%, #a78bfa 100%);
            padding: 34px 28px;
            text-align: center;
          "
        >
          <div
            style="
              display: inline-block;
              padding: 8px 14px;
              border-radius: 999px;
              background-color: rgba(255, 255, 255, 0.16);
              color: #ffffff;
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 0.8px;
              margin-bottom: 14px;
            "
          >
            Welcome to inPlace
          </div>

          <h1
            style="
              margin: 0;
              color: #ffffff;
              font-size: 28px;
              line-height: 1.25;
              font-weight: 800;
              letter-spacing: -0.5px;
            "
          >
            Verify Your Email
          </h1>

          <p
            style="
              margin: 12px 0 0;
              color: #f1eaff;
              font-size: 15px;
              line-height: 1.7;
            "
          >
            One small step to start matching your skills with meaningful opportunities.
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 34px 30px 28px">
          <p
            style="
              margin: 0 0 14px;
              color: #211a35;
              font-size: 16px;
              font-weight: 700;
            "
          >
            Hello,
          </p>

          <p
            style="
              margin: 0;
              color: #6f6883;
              font-size: 15px;
              line-height: 1.8;
            "
          >
            Thank you for joining <strong style="color: #7c3aed">inPlace</strong>.
            Use the verification code below to complete your registration and unlock your volunteer journey.
          </p>

          <!-- Code Box -->
          <div style="text-align: center; margin: 34px 0">
            <div
              style="
                display: inline-block;
                padding: 18px 30px;
                background: linear-gradient(180deg, #fbfaff 0%, #f1ebff 100%);
                border: 2px dashed #8b5cf6;
                border-radius: 18px;
                box-shadow: 0 10px 24px rgba(124, 58, 237, 0.12);
              "
            >
              <span
                style="
                  display: inline-block;
                  font-size: 34px;
                  line-height: 1;
                  font-weight: 800;
                  letter-spacing: 8px;
                  color: #4c1d95;
                "
              >
                {verificationCode}
              </span>
            </div>
          </div>

          <div
            style="
              background-color: #faf8ff;
              border: 1px solid #eadfff;
              border-radius: 16px;
              padding: 18px 18px;
              margin-bottom: 22px;
            "
          >
            <p
              style="
                margin: 0 0 10px;
                color: #211a35;
                font-size: 15px;
                font-weight: 700;
              "
            >
              What happens next?
            </p>

            <p
              style="
                margin: 0;
                color: #6f6883;
                font-size: 14px;
                line-height: 1.8;
              "
            >
              After verification, you can explore opportunities, build your profile,
              apply to roles that match your skills, and start creating real impact.
            </p>
          </div>

          <p
            style="
              margin: 0 0 12px;
              color: #6f6883;
              font-size: 14px;
              line-height: 1.8;
            "
          >
            Enter this code on the verification page to complete your registration.
          </p>

          <p
            style="
              margin: 0 0 12px;
              color: #6f6883;
              font-size: 14px;
              line-height: 1.8;
            "
          >
            This code will expire in
            <strong style="color: #4c1d95">10 minutes</strong>
            for security reasons.
          </p>

          <p
            style="
              margin: 0 0 24px;
              color: #6f6883;
              font-size: 14px;
              line-height: 1.8;
            "
          >
            If you did not create an account with us, you can safely ignore this email.
          </p>

          <!-- Motivation -->
          <div
            style="
              border-left: 4px solid #8b5cf6;
              padding: 14px 16px;
              background-color: #f7f2ff;
              border-radius: 12px;
              margin-bottom: 24px;
            "
          >
            <p
              style="
                margin: 0;
                color: #4b3b72;
                font-size: 14px;
                line-height: 1.8;
                font-style: italic;
              "
            >
              Your time, skills, and passion can make a difference. inPlace helps
              you turn every contribution into real experience and measurable impact.
            </p>
          </div>

          <p
            style="
              margin: 0;
              color: #211a35;
              font-size: 15px;
              line-height: 1.7;
            "
          >
            Best regards,<br />
            <strong style="color: #7c3aed">inPlace Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div
          style="
            background-color: #fbfaff;
            border-top: 1px solid #eee7ff;
            padding: 18px 24px;
            text-align: center;
          "
        >
          <p
            style="
              margin: 0 0 6px;
              color: #7c7394;
              font-size: 12px;
              line-height: 1.6;
            "
          >
            This is an automated message, please do not reply to this email.
          </p>

          <p
            style="
              margin: 0;
              color: #9b92b4;
              font-size: 12px;
              line-height: 1.6;
            "
          >
            © 2026 inPlace. Matching skills with service.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
`;