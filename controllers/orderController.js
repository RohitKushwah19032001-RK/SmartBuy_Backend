import Order from "../models/Order.js";
import Cart from "../models/Cart.js";




// ================= PLACE ORDER =================

export const placeOrder = async (req, res) => {

 try {

  const userId = req.userId;

  const {

   name,
   phone,
   address,
   city,
   state,
   pincode,
   paymentMethod

  } = req.body;


  // validation

  if(
   !name ||
   !phone ||
   !address ||
   !city ||
   !state ||
   !pincode
  ){

   return res.json({

    success:false,
    message:"Fill all fields"

   });

  }


  // get cart

  const cart =
  await Cart.findOne({
   userId
  })
  .populate("items.productId");


  if(
   !cart ||
   cart.items.length === 0
  ){

   return res.json({

    success:false,
    message:"Cart empty"

   });

  }


  // prepare order items

  let items = [];
  let total = 0;


  cart.items.forEach(item=>{

   items.push({

    productId:
    item.productId._id,

    name:
    item.productId.productName,

    price:
    item.productId.price,

    image:
    item.productId.image,

    quantity:
    item.quantity,

    shopId:
    item.productId.shopId

   });

   total +=
   item.productId.price *
   item.quantity;

  });


  // create order

  const order =
  new Order({

   userId,

   customer:{
    name,
    phone,
    address,
    city,
    state,
    pincode
   },

   items,

   amount:total,

   paymentMethod,

   // IMPORTANT
   payment:
   paymentMethod === "COD"
   ? false
   : false,

   status:"Order Placed",

   isAccepted:null,

   tracking:[
    {
     text:"Order Placed",
     date:Date.now()
    }
   ]

  });


  await order.save();


  // clear cart after order created

  cart.items = [];
  await cart.save();


  res.json({

   success:true,

   orderId:
   order._id,

   amount:total

  });


 } catch (error) {

  console.log(
   "Place Order Error:",
   error.message
  );

  res.json({

   success:false,
   message:error.message

  });

 }

};



// ================= VERIFY STRIPE PAYMENT =================

export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.json({
        success: false,
        message: "OrderId missing",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    // 🔥 IMPORTANT FIX (payment update)
    order.payment = true;
    order.status = "Order Placed";

    await order.save();

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log("Verify Payment Error:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



// ================= CUSTOMER CANCEL =================

export const cancelOrder =
async(req,res)=>{

 try {

  const {orderId} =
  req.body;


  const order =
  await Order.findById(orderId);


  if(!order){

   return res.json({

    success:false

   });

  }


  order.status =
  "Cancelled by Customer";


  order.isAccepted =
  false;


  order.tracking.push({

   text:"Cancelled by Customer",
   date:Date.now()

  });


  await order.save();


  res.json({

   success:true

  });

 } catch (error) {

  res.json({

   success:false,
   message:error.message

  });

 }

};



// ================= USER ORDERS =================

export const userOrders =
async(req,res)=>{

 try {

  const orders =
  await Order.find({

   userId:req.userId

  })
  .sort({date:-1});


  res.json({

   success:true,
   orders

  });

 } catch (error) {

  res.json({

   success:false,
   message:error.message

  });

 }

};



// ================= SHOP ORDERS =================

export const shopOrders =
async(req,res)=>{

 try {

  const shopId =
  req.shopId;


  const orders =
  await Order.find({

   items:{
    $elemMatch:{
     shopId:shopId
    }
   }

  })
  .sort({date:-1});


  res.json({

   success:true,
   orders

  });

 } catch (error) {

  res.json({

   success:false,
   message:error.message

  });

 }

};



// ================= ACCEPT / REJECT =================

export const acceptReject =
async(req,res)=>{

 try {

  const {
   orderId,
   isAccepted,
   reason
  } = req.body;


  const order =
  await Order.findById(orderId);


  if(!order){

   return res.json({

    success:false

   });

  }


  if(
   order.status ===
   "Cancelled by Customer"
  ){

   return res.json({

    success:false,
    message:"Order cancelled already"

   });

  }


  order.isAccepted =
  isAccepted;


  if(isAccepted){

   order.status =
   "Confirmed";


   order.tracking.push({

    text:"Confirmed",
    date:Date.now()

   });

  }

  else{

   order.status =
   reason;


   order.tracking.push({

    text:reason,
    date:Date.now()

   });

  }


  await order.save();


  res.json({

   success:true

  });

 } catch (error) {

  res.json({

   success:false,
   message:error.message

  });

 }

};



// ================= UPDATE STATUS =================

export const updateStatus =
async(req,res)=>{

 try {

  const {
   orderId,
   status
  } = req.body;


  const order =
  await Order.findById(orderId);


  if(!order){

   return res.json({

    success:false

   });

  }


  if(
   order.status ===
   "Cancelled by Customer"
  ){

   return res.json({

    success:false

   });

  }


  order.status =
  status;


  order.tracking.push({

   text:status,
   date:Date.now()

  });


  await order.save();


  res.json({

   success:true

  });

 } catch (error) {

  res.json({

   success:false,
   message:error.message

  });

 }

};