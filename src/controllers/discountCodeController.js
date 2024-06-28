import DiscountCode from "../models/discountCode.model.js";
import mongoose from "mongoose";
import Cart from "../models/carts.model.js";

// Obtener todos los códigos de descuento
export const getDiscountCodes = async (req, res, next) => {
  try {
    const discountCodes = await DiscountCode.find();
    return discountCodes;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener los códigos de descuento.' });
  }
};

// Crear un nuevo código de descuento
export const createDiscountCode = async (req, res) => {
  const { code, discountPercentage } = req.body;

  try {
    const newDiscountCode = new DiscountCode({
      code,
      discountPercentage
    });

    await newDiscountCode.save();
    res.status(201).json(newDiscountCode);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el código de descuento.' });
  }
};

// Eliminar un código de descuento por ID
export const deleteDiscountCode = async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica si el ID proporcionado es un ObjectId válido antes de intentar eliminar
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'ID de código de descuento no válido.' });
    }

    const deletedDiscountCode = await DiscountCode.findByIdAndDelete(id);
    if (!deletedDiscountCode) {
      return res.status(404).json({ message: 'Código de descuento no encontrado.' });
    }

    res.json({ message: 'Código de descuento eliminado correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el código de descuento.' });
  }
};

// Verificar y aplicar código de descuento
export const applyDiscountCode = async (req, res) => {
  const { code } = req.body;

  try {
    const discountCode = await DiscountCode.findOne({ code });

    if (!discountCode) {
      return res.status(404).json({ message: 'Código de descuento no encontrado.' });
    }

    // Obtener el carrito del usuario y aplicar el descuento al subtotal
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate('items.course');

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado.' });
    }

    let subtotal = 0;
    if (cart.items.length > 0) {
      subtotal = cart.items.reduce((acc, item) => acc + item.course.price, 0);
    }

    const discountPercentage = discountCode.discountPercentage;
    const discount = (subtotal * discountPercentage) / 100;
    const total = subtotal - discount;

    // Actualizar el carrito con el descuento aplicado
    cart.discount = discount;
    await cart.save();

    res.json({ discountPercentage, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al aplicar el código de descuento.' });
  }
};
