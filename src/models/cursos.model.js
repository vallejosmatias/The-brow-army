import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, 
  videoUrl: { type: String, required: true },
  imgUrl: { type: String, required: true }
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
