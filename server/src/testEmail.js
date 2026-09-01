require("dotenv").config();

const {
  sendBookingConfirmationEmail,
} = require("./services/emailService");

const test = async () => {
  try {
    const fakeBooking = {
      _id: "TEST-BOOKING-123",
      checkIn: "2026-09-10",
      checkOut: "2026-09-13",
      guests: 2,
      numberOfNights: 3,
      totalAmount: 615,
      paymentStatus: "paid",
    };

    const fakeVoucher = {
      voucherCode: "VAZHO-TEST123",
    };

    await sendBookingConfirmationEmail({
      email: process.env.EMAIL_USER,
      booking: fakeBooking,
      voucher: fakeVoucher,
    });

    console.log("Test email sent successfully.");
  } catch (error) {
    console.error("Test email failed:", error);
  }
};

test();