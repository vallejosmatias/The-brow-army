// Obtener referencia al formulario
const loginForm = document.getElementById("login-form");

// Obtener referencia al loader
const loader = document.getElementById("loader");

// Agregar un listener para el evento submit
loginForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Evitar que el formulario se envíe automáticamente

  // Mostrar el loader
  loader.style.display = "flex";

  // Obtener referencias a los campos del formulario
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // Obtener los valores de los campos
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Realizar validaciones
  if (email === "") {
    Swal.fire({
      title: 'Error',
      text: 'Por favor ingresa tu correo electrónico.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    loader.style.display = "none"; // Ocultar el loader en caso de error
    return;
  }

  if (password === "") {
    Swal.fire({
      title: 'Error',
      text: 'Por favor ingresa tu contraseña.',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    loader.style.display = "none"; // Ocultar el loader en caso de error
    return;
  }

  // Si todos los campos son válidos, enviar el formulario
  // usando Fetch API para realizar la solicitud al servidor
  fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  .then((response) => response.json().then(data => ({ status: response.status, body: data }))) // Obtener tanto el cuerpo como el estado de la respuesta
  .then((data) => {
    if (data.status === 200) { // Verificar si la respuesta es exitosa
      // Almacenar el token JWT en las cookies
      document.cookie = `token=${data.body.token}; path=/;`;
      // Añadir un retardo antes de redirigir
      setTimeout(() => {
        // Redireccionar al home si el inicio de sesión es exitoso
        window.location.href = "/";
      }, 3000);
    } else {
      // Mostrar alerta de error si la autenticación falla
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Datos invalidos",
      });
      loader.style.display = "none"; // Ocultar el loader en caso de error
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hubo un error en los datos",
    });
    loader.style.display = "none"; // Ocultar el loader en caso de error
  });
});

// login contraseña
document.getElementById('togglePassword').addEventListener('click', function (e) {
  // Obtener el campo de entrada de la contraseña y el icono de toggle
  const password = document.getElementById('password');
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  
  // Alternar el icono
  this.textContent = type === 'password' ? '👁️' : '🙈';
});