import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' } }],
  discountCode: { type: String }, 
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;


