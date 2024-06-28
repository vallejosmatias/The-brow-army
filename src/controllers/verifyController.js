import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

// Controlador para la verificación de correo electrónico
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Encuentra al usuario por el token de verificación de correo electrónico
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (user) {
    // Marca el correo electrónico como verificado
    user.verified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.redirect('/login'); // Redirige al usuario al login después de la verificación
  } else {
    res.status(400);
    throw new Error('El token de verificación de correo electrónico es inválido o ha expirado.');
  }
});