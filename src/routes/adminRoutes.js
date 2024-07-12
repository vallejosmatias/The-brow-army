import { Router } from "express";
import Course from "../models/cursos.model.js";
import { createDiscountCode, deleteDiscountCode, getDiscountCodes } from '../controllers/discountCodeController.js';
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { getExchangeRate, updateExchangeRate } from '../controllers/cotizacionController.js';
import Servicio from '../models/servicios.model.js'

const router = Router();

// Procesar la creación de un nuevo curso
router.post("/courses", async (req, res) => {
  try {
    const { title, description, price, priceUSD, imgUrl, videoUrl } = req.body;
    const newCourse = await Course.create({
      title,
      description,
      price,
      priceUSD,
      imgUrl,
      videoUrl,
    });
    res.redirect("/admin/courses"); // Redirige a la lista de cursos después de crear uno nuevo
  } catch (error) {
    console.error("Error al crear el curso:", error);
    res.redirect("/admin/courses"); // Maneja el error redirigiendo de nuevo al formulario
  }
});

// Procesar la actualización de un curso
router.post("/courses/edit/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    await Course.findByIdAndUpdate(courseId, req.body);
    res.redirect("/admin/courses");
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    res.redirect(`/admin/courses`);
  }
});

// Eliminar un curso
router.get("/courses/delete/:id", async (req, res) => {
  const courseId = req.params.id;
  try {
    await Course.findByIdAndDelete(courseId);
    res.redirect("/admin/courses");
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    res.redirect("/admin/courses");
  }
});

// Ruta para obtener la página de administración con cursos, productos, servicios y códigos de descuento
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    const products = await Product.find();
    const services= await Servicio.find();
    const users = await User.find(); // Asegúrate de que estás buscando los usuarios
    const discountCodes = await getDiscountCodes();
    res.render('admin', {
      title: 'Administrar Cursos y Descuentos',
      courses,
      users,
      products, // Asegúrate de que estás pasando los usuarios a la vista
      discountCodes,
      services,
      showNavbarFooter: true
    });
  } catch (error) {
    console.error('Error al obtener los cursos y códigos de descuento:', error);
    res.redirect('/admin');
  }
});

// Rutas para códigos de descuento
router.post('/discount-codes', createDiscountCode);
router.delete('/discount-codes/:id', deleteDiscountCode);


// agregar curso a un usuario
router.post('/confirm-transfer-payment', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).send('Usuario o curso no encontrado');
    }

       // Verificar si el curso ya está en la lista de cursos del usuario
       if (user.courses.includes(courseId)) {
        return res.status(400).send('El usuario ya tiene este curso');
      }

    user.courses.push(course);
    await user.save();

    // Aquí puedes marcar el pago como completado en tu base de datos

    res.status(200).send('Pago confirmado y curso añadido al usuario');
  } catch (error) {
    res.status(500).send('Error al confirmar el pago y añadir el curso al usuario');
  }
});

// traer los cursos del usuario
router.get('/getUserCourses/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('courses');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user.courses);
  } catch (error) {
    console.error('Error al obtener los cursos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los cursos del usuario' });
  }
});

// eliminar el curso del usuaario
router.post('/delete-course', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    user.courses.pull(courseId);
    await user.save();

    res.status(200).send('Curso eliminado del usuario');
  } catch (error) {
    console.error('Error al eliminar el curso del usuario:', error);
    res.status(500).send('Error al eliminar el curso del usuario');
  }
});

// productos
// Procesar la creación de un nuevo producto
router.post("/products", async (req, res) => {
  try {
    const { productName, productDescription, productPrice, productStock, productImgUrl, productCategory } = req.body;
    const newProduct = await Product.create({
      productName,
      productDescription,
      productPrice,
      productImgUrl,
      productStock,
      productCategory,
    });
    res.redirect("/admin/courses"); // Redirige a la lista de productos después de crear uno nuevo
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.redirect("/admin/courses"); // Maneja el error redirigiendo de nuevo al formulario
  }
});

// Procesar la actualización de un producto
router.post("/products/edit/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const { productName, productDescription, productPrice, productStock, productImgUrl, productCategory } = req.body;
    await Product.findByIdAndUpdate(productId, {
      productName,
      productDescription,
      productPrice,
      productStock,
      productImgUrl,
      productCategory
    });
    res.redirect("/admin/courses");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.redirect("/admin/courses");
  }
});

// Eliminar un producto
router.get("/products/delete/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.findByIdAndDelete(productId);
    res.redirect("/admin/courses");
    } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.redirect("/admin/courses");
    }
});

// Obtener la cotización actual
router.get('/exchange-rate', getExchangeRate);

// Actualizar la cotización
router.post('/exchange-rate', updateExchangeRate);

export default router;
