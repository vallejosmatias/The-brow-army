import mongoose from "mongoose";

const discountCodeSchema =  new mongoose.Schema({
  code: { type: String, required: true },
  discountPercentage: { type: Number, required: true }
});

const DiscountCode = mongoose.model('DiscountCode', discountCodeSchema);
export default DiscountCode;
