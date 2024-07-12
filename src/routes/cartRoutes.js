import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Obtener todos los carritos
router.get('/carts', protect, cartController.getAllCarts);

// Obtener un carrito por su ID
router.get('/carts/:id', protect, cartController.getCartById);

// Actualizar un carrito existente
router.put('/carts/:id', protect, cartController.updateCart);

// Añadir curso al carrito
router.post('/cart/add/:courseId', protect, cartController.addCourseToCart);

// Eliminar un curso del carrito
router.delete('/cart/remove/:courseId', protect, cartController.removeFromCart);

// Renderizar el carrito del usuario
router.get('/my-cart', protect, cartController.renderCart);

// Añadir cursos comprados al perfil del usuario
router.post('/add-courses-to-profile', protect, cartController.addCoursesToUserProfile);

// Ruta para eliminar el carrito después de un pago exitoso
router.delete('/cart/deleteAfterPayment', protect, cartController.deleteCartAfterPayment);

export default router;