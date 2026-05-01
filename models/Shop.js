import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const shopSchema = new mongoose.Schema({

 shopName:{
  type:String,
  required:true
 },

 email:{
  type:String,
  required:true,
  unique:true
 },

 password:{
  type:String,
  required:true
 },

 ownerName:{
  type:String,
  required:true
 },

 phone:{
  type:String
 },

 address:{
  type:String
 },
  city:{
  type:String,
  required:true
 },

 state:{
  type:String,
  required:true
 },

 pincode:{
  type:String,
  required:true
 },

 category:{
  type:String
 },

 description:{
  type:String
 },
image: {
  type: String,
  default: "https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/2e2732da-378f-4c8e-8fdc-fcb84f7e6ff6.jpg"
},


 createdAt:{
  type:Date,
  default:Date.now
 }

});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;