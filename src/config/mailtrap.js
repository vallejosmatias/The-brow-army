import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configura el transportador con Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Usa el host de Mailtrap
  port: 2525, // Usa el puerto de Mailtrap
  auth: {
    user: process.env.your_mailtrap_user, // Reemplaza con tu usuario de Mailtrap
    pass: process.env.your_mailtrap_password, // Reemplaza con tu contraseña de Mailtrap
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'no-reply@example.com', // Dirección de correo válida
    to: to, // Dirección de correo del usuario
    subject: subject,
    text: text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
  } catch (error) {
    console.error('Error al enviar correo electrónico: ' + error);
  }
};

export default sendEmail;
