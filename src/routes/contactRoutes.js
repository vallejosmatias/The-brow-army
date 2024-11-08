import express from "express";
import sendEmail from "../config/mailtrap.js"; // Asegúrate de ajustar la ruta a tu archivo de configuración de emails

const router = express.Router();

router.post("/send-email", async (req, res) => {
  const { nombre, apellido, profesion, pais, email, descripcion } = req.body;

  if (!nombre || !apellido || !profesion || !pais || !email) {
    return res.status(400).send("Por favor, completa todos los campos.");
  }

  // Construye el mensaje
  const subject = "Nuevo mensaje de contacto";
  const message = `
    Nombre: ${nombre}
    Apellido: ${apellido}
    Profesión: ${profesion}
    País: ${pais}
    Correo Electrónico: ${email}
    Descripción: ${descripcion}
  `;

  try {
    await sendEmail("thebrowarmy.acaemy@gmail.com", subject, message); // Reemplaza con la dirección de destino
    res.send("Mensaje enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar correo electrónico:", error);
    res.status(500).send("Error al enviar el mensaje.");
  }
});

export default router;
