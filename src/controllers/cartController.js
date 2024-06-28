import Cart from '../models/carts.model.js';
import Course from '../models/cursos.model.js';
import User from '../models/user.model.js';

// Obtener y renderizar el carrito del usuario
export const renderCart = async (req, res) => {
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId })
      .populate('items.course')
      .populate('discountCode'); // Poblar el campo discountCode

    if (!cart) {
      return res.render('cart', {
        title: 'Carrito de Compras',
        cart: { items: [] },
        subtotal: 0,
        discount: 0,
        total: 0
      });
    }

    let subtotal = 0;
    if (cart.items.length > 0) {
      subtotal = cart.items.reduce((acc, item) => acc + item.course.price, 0);
    }

    let discount = cart.discount || 0;


    let total = subtotal - discount;

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
  const userId = req.user._id; // Asumiendo que tienes autenticación implementada y `req.user` contiene el usuario actual
  const { courseId } = req.params;

  try {
    // Encontrar el carrito del usuario o crear uno nuevo si no existe
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Verificar si el curso ya está en el carrito
    const courseExists = cart.items.some(item => item.course.toString() === courseId);
    if (courseExists) {
      return res.status(400).json({ message: 'El curso ya está en el carrito' });
    }

    // Agregar el curso al carrito
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

// Eliminar un carrito existente
export const deleteCart = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCart = await Cart.findByIdAndDelete(id);
    if (!deletedCart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    res.json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito', error });
  }
};

// Eliminar un curso del carrito
export const removeFromCart = async (req, res) => {
  try {
    const { courseId } = req.params;
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

// añadir cursos al perfil
export const addCoursesToUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { courseIds } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Agregar los cursos comprados al perfil del usuario
    user.courses = [...new Set([...user.courses, ...courseIds])];
    await user.save();

    res.status(200).json({ message: 'Cursos añadidos al perfil del usuario', user });
  } catch (error) {
    console.error("Error al añadir cursos al perfil del usuario:", error);
    res.status(500).json({ message: 'Error al añadir cursos al perfil del usuario', error });
  }
};