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
   "https://smart-buy-frontend-liard.vercel.app/orders",

   cancel_url:
   "https://smart-buy-frontend-liard.vercel.app/cart"

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