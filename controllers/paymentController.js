import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ================= CUSTOMER PAYMENT =================

export const customerStripePayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // 🔥 VALIDATION FIX
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "OrderId missing",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "SmartBuy Order",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      // 🔥 IMPORTANT FIX (orderId safe pass)
      success_url: `https://smart-buy-frontend-liard.vercel.app/order-success?orderId=${orderId}`,

      cancel_url: "https://smart-buy-frontend-liard.vercel.app",
    });

    return res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};