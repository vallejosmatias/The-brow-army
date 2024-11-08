import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Configura el transportador con SendGrid SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net", // Host de SendGrid
  port: 587, // Puerto seguro para envío
  auth: {
    user: "apikey", // El usuario debe ser "apikey" cuando usas la API Key de SendGrid
    pass: process.env.SENDGRID_API_KEY, // Tu API Key de SendGrid desde las variables de entorno
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'thebrowarmyacademy@gmail.com', // Dirección de correo verificada en SendGrid
    to: to, // Dirección de correo del usuario
    subject: subject,
    text: text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado: ' + info.response);
  } catch (error) {
    console.error('Error al enviar correo electrónico: ' + error);
  }
};

export default sendEmail;
