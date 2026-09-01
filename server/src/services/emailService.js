const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendBookingConfirmationEmail = async ({
  email,
  booking,
  voucher,
}) => {
  if (!email) {
    throw new Error("Customer email is required.");
  }

  const mailOptions = {
    from: `"VAZHO Travel" <${process.env.EMAIL_USER}>`,
    to: email,

    subject: `VAZHO Booking Confirmation - ${voucher.voucherCode}`,

    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f5f5f5;
              font-family: Arial, sans-serif;
            }

            .container {
              max-width: 650px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            }

            .header {
              padding: 30px;
              text-align: center;
              background: #111111;
              color: #ffffff;
            }

            .header h1 {
              margin: 0;
              font-size: 30px;
            }

            .content {
              padding: 30px;
            }

            .success {
              color: #15803d;
              font-weight: bold;
            }

            .booking-box {
              margin-top: 20px;
              padding: 20px;
              border-radius: 10px;
              background: #f8fafc;
            }

            .row {
              margin-bottom: 12px;
            }

            .label {
              font-weight: bold;
            }

            .voucher {
              margin-top: 25px;
              padding: 20px;
              text-align: center;
              background: #f3f4f6;
              border-radius: 10px;
            }

            .voucher-code {
              margin-top: 10px;
              font-size: 26px;
              font-weight: bold;
              letter-spacing: 3px;
            }

            .footer {
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 13px;
            }
          </style>
        </head>

        <body>

          <div class="container">

            <div class="header">
              <h1>VAZHO</h1>
              <p>Your travel journey starts here.</p>
            </div>

            <div class="content">

              <h2>Booking Confirmed 🎉</h2>

              <p class="success">
                Your VAZHO booking has been successfully confirmed.
              </p>

              <div class="booking-box">

                <div class="row">
                  <span class="label">Booking ID:</span>
                  ${booking._id}
                </div>

                <div class="row">
                  <span class="label">Check-in:</span>
                  ${new Date(booking.checkIn).toLocaleDateString()}
                </div>

                <div class="row">
                  <span class="label">Check-out:</span>
                  ${new Date(booking.checkOut).toLocaleDateString()}
                </div>

                <div class="row">
                  <span class="label">Guests:</span>
                  ${booking.guests}
                </div>

                <div class="row">
                  <span class="label">Nights:</span>
                  ${booking.numberOfNights}
                </div>

                <div class="row">
                  <span class="label">Total Amount:</span>
                  ₹${booking.totalAmount}
                </div>

                <div class="row">
                  <span class="label">Payment:</span>
                  ${booking.paymentStatus}
                </div>

              </div>

              <div class="voucher">

                <div>
                  Your Voucher Code
                </div>

                <div class="voucher-code">
                  ${voucher.voucherCode}
                </div>

                <p>
                  Keep this voucher code for your trip.
                </p>

              </div>

              <p>
                Thank you for choosing VAZHO.
                We wish you a wonderful journey!
              </p>

            </div>

            <div class="footer">
              © ${new Date().getFullYear()} VAZHO Travel.
              This is an automated email.
            </div>

          </div>

        </body>
      </html>
    `,
  };

  const result = await transporter.sendMail(mailOptions);

  return result;
};

const sendPaymentConfirmationEmail = async ({
  email,
  booking,
  paymentId,
}) => {
  if (!email) {
    throw new Error("Customer email is required.");
  }

  const mailOptions = {
    from: `"VAZHO Travel" <${process.env.EMAIL_USER}>`,
    to: email,

    subject: `VAZHO Payment Confirmation - ${booking._id}`,

    html: `
      <h2>Payment Successful 🎉</h2>

      <p>Your payment for VAZHO booking has been successfully received.</p>

      <p>
        <strong>Booking ID:</strong>
        ${booking._id}
      </p>

      <p>
        <strong>Payment ID:</strong>
        ${paymentId}
      </p>

      <p>
        <strong>Amount:</strong>
        ₹${booking.totalAmount}
      </p>

      <p>
        Thank you for choosing VAZHO.
      </p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmationEmail,
  sendPaymentConfirmationEmail,
};