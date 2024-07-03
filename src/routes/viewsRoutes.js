import { Router } from "express";
import Cart from "../models/carts.model.js";
import Course from "../models/cursos.model.js";
import forgotRoutes from './forgotRoutes.js'; // Importa las rutas de restablecimiento
import Product from "../models/product.model.js";


const router = Router();

// Registro
router.get("/register", (req, res) => {
  res.render("register", { title: "Registrarse" });
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { title: "Iniciar Sesión" });
});

// Cursos
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.render("courses", {
      courses,
      title: "Catalogo",
      showNavbarFooter: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error de servidor", error });
  }
});

// Curso individual
router.get("/course/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    res.render("course", {
      course: course,
      title: "Curso",
      showNavbarFooter: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Error del servidor", error });
  }
});

// Home
router.get("/", async (req, res) => {
  res.render("home", { title: "The brow Army", showNavbarFooter: true });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Nosotros
router.get('/nosotros', (req,res) =>{
  res.render('nosotros',{title: 'Sobre nosotros', showNavbarFooter: true} )
})

// Ruta para mostrar el formulario de olvido de contraseña
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', {title: 'Recuperá tu contraseña'}); // Renderiza tu página forgot-password.hbs
});

// Ruta para mostrar el formulario de restablecimiento de contraseña
router.get('/reset-password/:token', (req, res) => {
  res.render('reset-password', { title: 'Restablecer Contraseña', token: req.params.token });
});

// Integrar forgotRoutes
router.use(forgotRoutes);

// products
router.get('/products-all', async (req, res) => {
  try {
      const products = await Product.find();
      
      // Agrupar productos por categoría
      const categories = {};
      products.forEach(product => {
          if (!categories[product.productCategory]) {
              categories[product.productCategory] = [];
          }
          categories[product.productCategory].push(product);
      });

      res.render('products', { categories , title: 'Productos', showNavbarFooter:true});
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener los productos.');
  }
});

export default router;
