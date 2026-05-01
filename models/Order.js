import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

 userId:{
  type:String,
  required:true
 },

 customer:{
  name:String,
  phone:String,
  address:String,
  city:String,
  state:String,
  pincode:String
 },

 items:[
  {
   productId:String,
   name:String,
   price:Number,
   image:String,
   quantity:Number,
   shopId:String
  }
 ],

 amount:{
  type:Number,
  required:true
 },

 payment:{
  type:Boolean,
  default:false
 },

 paymentMethod:{
  type:String,
  default:"COD"
 },

 status:{
  type:String,
  default:"Order Placed"
 },

 isAccepted:{
  type:Boolean,
  default:null
 },

 cancelReason:{
  type:String,
  default:""
 },

 tracking:[
  {
   text:String,
   date:{
    type:Date,
    default:Date.now
   }
  }
 ],

 date:{
  type:Date,
  default:Date.now
 }

});

export default mongoose.model("Order",orderSchema);