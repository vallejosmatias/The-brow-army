import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

// Aplicar el middleware de protección a todas las rutas de órdenes
router.use(protect);

// Obtener todas las órdenes
router.get('/orders', orderController.getAllOrders);

// Obtener una orden por su ID
router.get('/orders/:id', orderController.getOrderById);

// Crear una nueva orden
router.post('/orders', orderController.createOrder);

// Actualizar una orden existente
router.put('/orders/:id', orderController.updateOrder);

// Eliminar una orden existente
router.delete('/orders/:id', orderController.deleteOrder);

export default router;
