// Obtener referencia al formulario
const registerForm = document.getElementById("register-form");

// Obtener referencia al loader
const loader = document.getElementById("loader");

// Agregar un listener para el evento submit
registerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    // Mostrar el loader
    loader.style.display = "flex";

  // Obtener referencias a los campos del formulario
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Obtener los valores de los campos
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Realizar validaciones
  if (name === "") {
    alert("Por favor ingresa tu nombre");
    loader.style.display = "none"; // Ocultar el loader en caso de error
    return;
  }

  if (email === "" || !validateEmail(email)) {
    alert("Por favor ingresa un correo electrónico válido");
    loader.style.display = "none"; // Ocultar el loader en caso de error
    return;
  }

  if (password === "") {
    alert("Por favor ingresa una contraseña");
    loader.style.display = "none"; // Ocultar el loader en caso de error
    return;
  }

  // Si todos los campos son válidos, enviar el formulario
  registerForm.submit();
});

// Función para validar el formato del correo electrónico
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}


