import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productImgUrl: { type: String },
  productCategory: { type: String },
  productStock: {type: Number, required:true}
});

const Product = mongoose.model('Product', productSchema);

export default Product;