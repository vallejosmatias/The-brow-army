<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recoger y sanitizar los datos del formulario
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $apellido = htmlspecialchars(trim($_POST['apellido']));
    $profesion = htmlspecialchars(trim($_POST['profesion']));
    $pais = htmlspecialchars(trim($_POST['pais']));
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $descripcion = htmlspecialchars(trim($_POST['descripcion']));

    // Validar que los campos no están vacíos
    if (!empty($nombre) && !empty($apellido) && !empty($profesion) && !empty($pais) && !empty($email)) {
        // Establecer el destinatario y el asunto del correo
        $to = "thebrowarmy.acaemy@gmail.com";  // Reemplaza con tu dirección de correo
        $subject = "Nuevo mensaje de contacto";

        // Construir el cuerpo del mensaje
        $message = "Nombre: $nombre\n";
        $message .= "Apellido: $apellido\n";
        $message .= "Profesión: $profesion\n";
        $message .= "País: $pais\n";
        $message .= "Correo Electrónico: $email\n";
        $message .= "Descripción:\n$descripcion\n";

        // Establecer los encabezados del correo
        $headers = "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";

        // Enviar el correo
        if (mail($to, $subject, $message, $headers)) {
            echo "Mensaje enviado correctamente.";
        } else {
            echo "Error al enviar el mensaje.";
        }
    } else {
        echo "Por favor, completa todos los campos.";
    }
} else {
    echo "Método de solicitud no válido.";
}
?>
