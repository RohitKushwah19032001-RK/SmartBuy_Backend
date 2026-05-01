import Stripe from "stripe";

const stripe =
new Stripe(process.env.STRIPE_SECRET_KEY);


export const stripePayment =
async(req,res)=>{

 try {

  const session =
  await stripe.checkout.sessions.create({

   payment_method_types:["card"],

   line_items:[
    {
     price_data:{
      currency:"inr",
      product_data:{
       name:"Order Payment"
      },
      unit_amount:
      req.body.amount * 100
     },

     quantity:1
    }
   ],

   mode:"payment",

   success_url:
   "http://localhost:5173/orders",

   cancel_url:
   "http://localhost:5173/cart"

  });


  res.json({

   url:session.url

  });

 } catch (error) {

  res.json({

   success:false,
   message:error.message

  });

 }

};