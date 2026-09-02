import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const buildApiUrl = (path) => {
  const base = API_URL.replace(/\/$/, "").replace(/\/api$/, "");
  const normalizedPath = path.startsWith("/api")
    ? path
    : `/api${path.startsWith("/") ? path : `/${path}`}`;

  return `${base}${normalizedPath}`;
};

function PaymentButton({ bookingId, amount, user, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("vazho_token");

      if (!token) {
        setError("Please login before making payment.");
        return;
      }

      // =================================================
      // CREATE RAZORPAY ORDER
      // =================================================

      const response = await fetch(buildApiUrl("/payments/create-order"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create payment order."
        );
      }

      // =================================================
      // RAZORPAY CHECKOUT
      // =================================================

      if (!window.Razorpay) {
        throw new Error("Razorpay Checkout failed to load.");
      }

      const options = {
        key: data.keyId,

        amount: data.order.amount,

        currency: data.order.currency,

        name: "VAZHO",

        description: `Booking Payment #${bookingId}`,

        order_id: data.order.id,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#000000",
        },

        handler: async function (paymentResponse) {
          try {
            // =================================================
            // VERIFY PAYMENT ON SERVER
            // =================================================

            const verifyResponse = await fetch(buildApiUrl("/payments/verify"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                bookingId,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed."
              );
            }

            alert("Payment successful!");

            if (onSuccess) {
              onSuccess(verifyData.booking);
            }
          } catch (verificationError) {
            console.error(verificationError);

            setError(
              verificationError.message ||
                "Payment verification failed."
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Razorpay checkout closed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);

        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);

      setError(
        err.message ||
          "Something went wrong while starting payment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handlePayment}
        disabled={loading}
        className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default PaymentButton;