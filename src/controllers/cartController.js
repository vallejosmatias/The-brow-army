import Cart from '../models/carts.model.js';
import Course from '../models/cursos.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Obtener y renderizar el carrito del usuario
export const renderCart = async (req, res) => {
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId })
      .populate('items.course')
      .populate('discountCode');

    if (!cart) {
      return res.render('cart', {
        title: 'Carrito de Compras',
        cart: { items: [] },
        subtotal: 0,
        discount: 0,
        total: 0
      });
    }

    cart.items = cart.items.filter(item => item.course); // Filtrar items válidos
    const subtotal = cart.items.reduce((acc, item) => acc + item.course.price, 0);
    const discount = cart.discount || 0;
    const total = subtotal - discount;

    res.render('cart', {
      title: 'Carrito de Compras',
      cart,
      subtotal,
      discount,
      total
    });
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
    res.status(500).send('Error al cargar el carrito');
  }
};

// Obtener todos los carritos
export const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los carritos', error });
  }
};

// Obtener un carrito por su ID
export const getCartById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de carrito no válido' });
  }

  try {
    const cart = await Cart.findById(id);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
};

export const addCourseToCart = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'ID de curso no válido' });
  }

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const courseExists = cart.items.some(item => item.course.toString() === courseId);
    if (courseExists) {
      return res.status(400).json({ message: 'El curso ya está en el carrito' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    cart.items.push({ course: courseId });
    await cart.save();

    res.status(200).json({ message: 'Curso agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el curso al carrito', error });
  }
};

// Actualizar un carrito existente
export const updateCart = async (req, res) => {
  const { id } = req.params;
  const { user, items } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de carrito no válido' });
  }

  try {
    const updatedCart = await Cart.findByIdAndUpdate(id, { user, items }, { new: true });
    if (!updatedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
};

// Eliminar el carrito después de un pago exitoso
export const deleteCartAfterPayment = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (cart) {
      res.status(200).json({ message: 'Carrito eliminado después del pago exitoso' });
    } else {
      res.status(404).json({ message: 'No se encontró carrito para eliminar' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito después del pago', error });
  }
};

// Eliminar un curso del carrito
export const removeFromCart = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'ID de curso no válido' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = cart.items.filter(item => item.course.toString() !== courseId);
      await cart.save();
      res.status(200).json({ message: 'Curso eliminado del carrito' });
    } else {
      res.status(404).json({ message: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso del carrito', error });
  }
};

// Controlador para añadir cursos al perfil del usuario
export const addCoursesToUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { courseIds } = req.body;

  try {
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron IDs de cursos válidos' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const validCourseIds = courseIds
      .filter(courseId => courseId && mongoose.Types.ObjectId.isValid(courseId))
      .map(courseId => new mongoose.Types.ObjectId(courseId));

    if (validCourseIds.length === 0) {
      return res.status(400).json({ message: 'IDs de cursos no válidos' });
    }

    const existingCourses = await Course.find({ _id: { $in: validCourseIds } });

    if (existingCourses.length !== validCourseIds.length) {
      return res.status(400).json({ message: 'Algunos cursos no existen' });
    }

    validCourseIds.forEach(courseId => {
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      }
    });

    await user.save();

    res.status(200).json({ message: 'Cursos añadidos al perfil del usuario', user });
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir cursos al perfil del usuario', error });
  }
};
