import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js'; // Importa tu modelo de usuario
import crypto from 'crypto';
import sendEmail from '../config/mailtrap.js'; // Importa la función de enviar correo

// Controlador para enviar el correo electrónico de restablecimiento de contraseña
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    // Generar y guardar el token de restablecimiento
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Enviar el correo electrónico con el enlace de restablecimiento al usuario encontrado
    const resetUrl = `http://thebrowarmy.com/reset-password/${token}`;
    const message = `Has solicitado restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`;

    await sendEmail(user.email, 'Solicitud de Restablecimiento de Contraseña', message);
    res.render('preview-reset', { 
      title: 'Solicitud de Restablecimiento de Contraseña', 
      name: user.name, 
      email: user.email 
  });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado.');
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).send('Token de restablecimiento de contraseña inválido o expirado.');
    return;
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.redirect('/login');
});
