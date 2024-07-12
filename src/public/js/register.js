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

  const passwordError = validatePassword(password);
  if (passwordError) {
    alert(passwordError);
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

// register contraseña
document.getElementById('togglePassword').addEventListener('click', function (e) {
  // Obtener el campo de entrada de la contraseña y el icono de toggle
  const password = document.getElementById('password');
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  
  // Alternar el icono
  this.textContent = type === 'password' ? '👁️' : '🙈';
});

// Función para validar la contraseña
function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (password.length < minLength) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!hasUpperCase) {
    return "La contraseña debe contener al menos una letra mayúscula.";
  }
  if (!hasNumber) {
    return "La contraseña debe contener al menos un número.";
  }
  return null;
}
