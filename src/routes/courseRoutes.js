import {Router} from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeAdmin } from '../middlewares/authorize.js';
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/courseController.js';

const router = Router();

// Rutas para obtener todos los cursos y crear un curso (protegidas por autenticación)
router.get('/', getCourses)
router.post('/', protect, authorizeAdmin, createCourse);

// Rutas para obtener, actualizar y eliminar un curso por ID (protegidas por autenticación y autorización)
router.get('/:id', getCourseById)
router.put('/:id', protect, authorizeAdmin, updateCourse)
router.delete('/:id', protect, authorizeAdmin, deleteCourse);

export default router;
