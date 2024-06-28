import { Router } from "express";
import * as cartController from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Obtener todos los carritos
router.get("/carts", cartController.getAllCarts);

// Obtener un carrito por su ID
router.get("/carts/:id", cartController.getCartById);

// Actualizar un carrito existente
router.put("/carts/:id", cartController.updateCart);

// Eliminar un carrito existente
router.delete("/carts/:id", cartController.deleteCart);

// Añadir curso al carrito
router.post("/cart/add/:courseId", protect, cartController.addCourseToCart);

// Eliminar un curso del carrito
router.delete("/cart/remove/:courseId", protect, cartController.removeFromCart);

// Renderizar el carrito del usuario
router.get("/my-cart", protect, cartController.renderCart);

// Añadir cursos comprados al perfil del usuario
router.post("/add-courses-to-profile", protect, cartController.addCoursesToUserProfile);


export default router;
