import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

 productName:{
  type:String,
  required:true
 },

 price:{
  type:Number,
  required:true
 },

 description:String,

 category:String,

shopName: {        
   type: String,
   required: true
 },

 image:{
  type:String,
  default:"https://via.placeholder.com/200"
 },

 // NEW FIELDS
 amazonLink:String,
 flipkartLink:String,

 shopId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Shop",
  required:true
 }

},{timestamps:true});

export default mongoose.model("Product",productSchema);