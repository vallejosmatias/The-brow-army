import Order from '../models/orders.model.js';

// Obtener todas las órdenes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes', error });
  }
};

// Obtener una orden por su ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la orden', error });
  }
};

// Crear una nueva orden
export const createOrder = async (req, res) => {
  const { user, orderItems, totalPrice } = req.body;
  try {
    const newOrder = await Order.create({ user, orderItems, totalPrice });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la orden', error });
  }
};

// Actualizar una orden existente
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user, orderItems, totalPrice } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, { user, orderItems, totalPrice }, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la orden', error });
  }
};

// Eliminar una orden existente
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    res.json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la orden', error });
  }
};
