import {Router} from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import {verifyEmail} from '../controllers/verifyController.js'
import sendEmail from "../config/mailtrap.js";

const router = Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  };
  
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;


    try {
        // Buscar al usuario en la base de datos
        const user = await User.findOne({ email });

        // Verificar si el usuario existe y la contraseña es correcta
        if (user && (await user.matchPassword(password))) {
            // Generar y enviar el token JWT
            const token = generateToken(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token
            });
                
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
  

// Ruta para procesar el registro de usuario
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Crear un nuevo usuario
    const user = new User({ name, email, password });

    // Genera y guarda el token de verificación de correo electrónico
    user.generateEmailVerificationToken();
    await user.save();

    // Envía el correo electrónico de verificación
    const verificationUrl = `http://thebrowarmy.com/api/users/verify-email/${user.emailVerificationToken}`;
    const message = `Hola ${user.name}, por favor haz click en este enlace para verificar tu correo electrónico: ${verificationUrl}`;

    await sendEmail(user.email, "Verificación de Correo Electrónico", message);

      // Establecer una cookie con el correo electrónico del usuario
      res.cookie('email', user.email, { httpOnly: true, secure: false });

    // Redireccionar al usuario a la página de verificación después del registro exitoso
    res.redirect(`/api/users/verify?name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Ruta para manejar la verificación de correo electrónico
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Buscar el usuario con el token de verificación de correo electrónico
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Verificar el correo electrónico
    user.isEmailVerified = true;
    user.emailVerificationToken = null; // O puedes usar user.emailVerificationToken = undefined;
    await user.save();

    // Envía el correo electrónico de bienvenida
    const welcomeMessage = `
¡Bienvenida, ${user.name}!

Estamos encantados de darte la bienvenida a nuestra comunidad de aprendizaje online. Tu decisión de unirte a nosotros nos llena de alegría, y estamos aquí para asegurarnos de que tu experiencia sea enriquecedora y gratificante.

En nuestra plataforma, encontrarás una amplia gama de cursos diseñados para ayudarte a alcanzar tus objetivos, ya sea mejorar tus habilidades profesionales, explorar nuevas pasiones o simplemente aprender algo nuevo y emocionante.

¿Qué puedes esperar de nosotros?

Cursos de Alta Calidad: Todos nuestros cursos están creados por expertos en sus respectivos campos, garantizando contenido relevante y actualizado.
Flexibilidad Total: Aprende a tu propio ritmo, desde cualquier lugar y en cualquier momento. Nuestra plataforma está disponible 24/7 para adaptarse a tu horario.
Soporte Continuo: Nuestro equipo de soporte está siempre disponible para ayudarte con cualquier duda o problema que puedas tener.


Una vez más, ¡bienvenida a bordo! Estamos emocionados de ser parte de tu camino hacia el conocimiento y el crecimiento personal.

Saludos cordiales,

Liz Sanchez
The Brow Army
thebrowarmyacademy@gmail.com
    `;
    await sendEmail(user.email, "Bienvenida a Nuestra Plataforma", welcomeMessage);
    // Redireccionar o responder con éxito
    res.redirect("/login")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Ruta para renderizar la página de verificación de correo electrónico
router.get("/verify", (req, res) => {
  const { name, email} = req.query;
  res.render("verify", { title: "Verificación de Correo Electrónico", name, email });
});

// Ruta para reenviar el correo de verificación
router.get('/resend-verification', async (req, res) => {
  const email = req.cookies.email; // Obtén el correo electrónico de la cookie

  if (!email) {
    return res.status(400).json({ message: 'No email found in cookies.' });
  }

  try {
    // Encuentra al usuario por su correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    let verificationUrl;
    // Comprueba si ya existe un token de verificación válido
    if (user.emailVerificationToken && user.emailVerificationExpires > Date.now()) {
      verificationUrl = `http://localhost:3000/api/users/verify-email/${user.emailVerificationToken}`;
    } else {
      // Genera y guarda un nuevo token de verificación de correo electrónico
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();
      verificationUrl = `http://localhost:3000/api/users/verify-email/${verificationToken}`;
    }

    const message = `Hola ${user.name}, por favor haz click en este enlace para verificar tu correo electrónico: ${verificationUrl}`;

    await sendEmail(user.email, "Reenvío de Verificación de Correo Electrónico", message);

    res.render('verify')
  } catch (error) {
    console.error('Error al reenviar el correo de verificación:', error);
    res.status(500).json({ message: 'Error del servidor al reenviar el correo de verificación.' });
  }
});

// Ruta para reenviar el correo de restablecimiento de contraseña
router.get('/resend-password-reset', async (req, res) => {
  const email = req.cookies.email; // Obtén el correo electrónico de la cookie

  if (!email) {
    return res.status(400).json({ message: 'No email found in cookies.' });
  }

  try {
    // Encuentra al usuario por su correo electrónico
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    let resetUrl;
    // Comprueba si ya existe un token de restablecimiento válido
    if (user.passwordResetToken && user.passwordResetExpires > Date.now()) {
      resetUrl = `http://localhost:3000/reset-password/${user.passwordResetToken}`;
    } else {
      // Genera y guarda un nuevo token de restablecimiento de contraseña
      const resetToken = user.generatePasswordResetToken();
      await user.save();
      resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    }

    const message = `Hola ${user.name}, por favor haz click en este enlace para restablecer tu contraseña: ${resetUrl}`;

    await sendEmail(user.email, "Reenvío de Restablecimiento de Contraseña", message);

    res.render('preview-reset');
  } catch (error) {
    console.error('Error al reenviar el correo de restablecimiento de contraseña:', error);
    res.status(500).json({ message: 'Error del servidor al reenviar el correo de restablecimiento de contraseña.' });
  }
});

// ruta logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});



export default router;
