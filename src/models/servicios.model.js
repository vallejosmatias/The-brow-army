import mongoose from 'mongoose';

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  imgUrl: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  duracion: { type: String, required: true },
});

const Servicio = mongoose.model('Servicio', servicioSchema);

export default Servicio;
