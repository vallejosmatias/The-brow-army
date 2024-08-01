document.addEventListener("DOMContentLoaded", function () {
  const addToCartBtn = document.getElementById("addToCartBtn");

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      const courseId = this.getAttribute("data-course-id"); // Obtener el ID del curso desde el atributo data
      if (isUserAuthenticated()) {
        addToCart(courseId);
      } else {
        showAuthenticationRequiredAlert();
      }
    });
  }

  // Agregar manejador de eventos para botones de eliminación
  document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const courseId = this.getAttribute("data-course-id");
      removeFromCart(courseId);
    });
  });

  function isUserAuthenticated() {
    return document.cookie.includes("token");
  }

  function showAuthenticationRequiredAlert() {
    Swal.fire({
      icon: "warning",
      title: "No autenticado",
      text: "Por favor, inicia sesión para agregar cursos al carrito.",
      footer: '<a href="/login">Ir a iniciar sesión</a>',
    });
  }

  function addToCart(courseId) {
    fetch(`/api/cart/add/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseId }),
    })
      .then((response) => {
        if (response.ok) {
          // Manejar la respuesta del servidor (opcional)
          console.log("Curso agregado al carrito");
          Toastify({
            text: "Curso agregado",
            offset: {
              x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
              y: 85, // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
            duration: 2000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "linear-gradient(45deg, #ae8625, #f7ef8a, #d2ac47)",
            },
          }).showToast();
        } else {
          Swal.fire({
            title: "Error",
            text: "Ya tiene ese curso en tu carrito",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function removeFromCart(courseId) {
    fetch(`/api/cart/remove/${courseId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Manejar la respuesta del servidor (opcional)
          console.log("Curso eliminado del carrito");
          window.location.reload(); // Recargar la página para actualizar el carrito
          Toastify({
            text: "Curso eliminado",
            offset: {
              x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
              y: 85, // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
            duration: 2000,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "rgb(121,9,9)",
              background:
                "linear-gradient(90deg, rgba(121,9,9,1) 0%, rgba(255,0,0,1) 100%)",
            },
          }).showToast();
        } else {
          console.error("Error al eliminar el curso del carrito");
          Swal.fire({
            title: "Error",
            text: "Error al eliminar el curso del carrito",
            icon: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const discountForm = document.getElementById("discountForm");
  const discountCodeInput = document.getElementById("discountCodeInput");
  const discountAmountElement = document.getElementById("discount");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  discountForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const code = discountCodeInput.value;

    // Mostrar el loader
    showLoader();

    try {
      const response = await fetch("/api/discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Código de descuento no válido.");
      }

      const data = await response.json();
      const discountPercentage = data.discountPercentage;

      const subtotal = parseFloat(subtotalElement.textContent.replace("$", ""));
      const discount = (subtotal * discountPercentage) / 100;
      const total = subtotal - discount;

      subtotalElement.textContent = `$${subtotal}`;
      discountAmountElement.textContent = `$${discount}`;
      totalElement.textContent = `$${total}`;
    } catch (error) {
      console.error("Error al aplicar el código de descuento:", error);
      alert("Error al aplicar el código de descuento. Inténtalo de nuevo.");
    } finally {
      // Ocultar el loader
      hideLoader();
    }
  });
});

// modal
document.addEventListener("DOMContentLoaded", function () {
  const transferRadio = document.getElementById("transferRadio");
  const transferModal = document.getElementById("transferModal");
  const closeModal = document.querySelector(".close");

  // Mostrar el modal cuando se selecciona la opción de transferencia bancaria
  transferRadio.addEventListener("change", function () {
    if (transferRadio.checked) {
      const totalElement = document.getElementById("total");
      const totalToSend = parseFloat(totalElement.textContent.replace("$", ""));
      const discount = totalToSend * 0.1;
      const totalWithTransferDiscount = totalToSend - discount;
      const transferTotal = document.getElementById("transferTotal");
      transferTotal.textContent = `$${totalWithTransferDiscount.toFixed(2)}`;
      transferModal.style.display = "block";
    }
  });

  // Cerrar el modal cuando se hace clic en la "x"
  closeModal.addEventListener("click", function () {
    transferModal.style.display = "none";
  });

  // Cerrar el modal cuando se hace clic fuera del contenido del modal
  window.onclick = function (event) {
    if (event.target == transferModal) {
      transferModal.style.display = "none";
    }
  };
});

// mp
const mp = new MercadoPago("APP_USR-93721164-512c-4d77-a521-4fb47b5e4c1a", {
  locale: "es-AR",
});

document.getElementById("methodPayment").addEventListener("click", async () => {
  showLoader();

  try {
    const cartItems = [];

    document.querySelectorAll(".cart-item").forEach((itemElement) => {
      const title = itemElement.querySelector("h2").innerText;
      const price = Number(
        itemElement.querySelector(".cont-btn p").innerText.replace("$", "")
      );
      const quantity = 1;

      cartItems.push({
        title,
        quantity,
        unit_price: price,
        currency_id: "ARS",
      });
    });

    const subtotalARS = Number(
      document.getElementById("subtotal").innerText.replace("$", "")
    );
    const discountARS = Number(
      document
        .getElementById("discount")
        .innerText.replace("$", "")
        .replace("-", "")
    );
    const totalARS = subtotalARS - discountARS;

    const response = await fetch("/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        discount: discountARS,
        total: totalARS,
      }),
    });

    const preference = await response.json();
    createCheckoutButton(preference.id);

    const courseIds = [...document.querySelectorAll(".cart-item")].map((item) =>
      item.getAttribute("data-course-id")
    );
    await fetch("/api/add-courses-to-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseIds }),
    });

    await emptyCart(); // Llamada para vaciar el carrito

  } catch (error) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    alert("Error al crear la preferencia de Mercado Pago. Inténtalo de nuevo.");
  } finally {
    hideLoader();
  }
});

const createCheckoutButton = (preferenceId) => {
  const bricksBuilder = mp.bricks();

  const renderComponent = async () => {
    if (window.checkoutButton) {
      await window.checkoutButton.unmount();
    }

    await bricksBuilder.create("wallet", "wallet_container", {
      initialization: {
        preferenceId: preferenceId,
        redirectMode: "modal",
      },
    });
  };

  renderComponent();
};

// paypal
document.addEventListener("DOMContentLoaded", function () {
  const paypalButtonContainer = document.getElementById(
    "paypal-button-container"
  );

  if (paypalButtonContainer) {
    paypal
      .Buttons({
        createOrder: function (data, actions) {
          const total = parseFloat(
            document.getElementById("total").textContent.replace("$", "")
          );

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                  currency_code: "USD",
                },
              },
            ],
          });
        },
        onApprove: async function (data, actions) {
          return actions.order.capture().then(async function (details) {
            alert("Pago completado con éxito");
            const courseIds = [...document.querySelectorAll(".cart-item")].map(
              (item) => item.getAttribute("data-course-id")
            );

            try {
              const response = await fetch("/api/add-courses-to-profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ courseIds }),
              });

              if (response.ok) {
                alert("Cursos añadidos a tu perfil");

                await emptyCart(); // Llamada para vaciar el carrito

                window.location.href = "/profile"; // Redirige al perfil del usuario o a donde quieras
              } else {
                const errorResponse = await response.json();
                console.error("Error response:", errorResponse); // Depuración: Verificar el mensaje de error
                throw new Error("Error al añadir cursos a tu perfil");
              }
            } catch (error) {
              console.error("Error al añadir cursos a tu perfil:", error);
            }
          });
        },
        onError: function (err) {
          console.error("Error en el pago de PayPal:", err);
          alert("Hubo un problema con el pago. Por favor, inténtelo de nuevo.");
        },
      })
      .render("#paypal-button-container");
  }
});

// cambio de divisas
document.getElementById("divisas").addEventListener("change", function () {
  const selectedCurrency = this.value;

  // Realiza una solicitud al servidor para obtener la tasa de cambio
  fetch("/admin/exchange-rate")
    .then((response) => response.json())
    .then((data) => {
      const exchangeRate = data.rate; // Obtén la tasa de cambio del servidor

      // Recorrer todos los elementos del carrito y actualizar los precios
      document.querySelectorAll(".cart-item").forEach((itemElement) => {
        const priceElement = itemElement.querySelector(".cont-btn p");
        let price = Number(priceElement.innerText.replace("$", ""));

        if (selectedCurrency === "ARS") {
          // Convertir el precio a ARS si está en USD
          price = price * exchangeRate;
        } else if (selectedCurrency === "USD") {
          // Convertir el precio a USD si está en ARS
          price = price / exchangeRate;
        }

        priceElement.innerText = `$${price.toFixed(2)}`;
      });

      // Actualizar subtotal, descuento y total
      const subtotalElement = document.getElementById("subtotal");
      const discountElement = document.getElementById("discount");
      const totalElement = document.getElementById("total");

      let subtotal = Number(subtotalElement.innerText.replace("$", ""));
      let discount = Number(
        discountElement.innerText.replace("$", "").replace("-", "")
      );
      let total = Number(totalElement.innerText.replace("$", ""));

      if (selectedCurrency === "ARS") {
        subtotal *= exchangeRate;
        discount *= exchangeRate;
        total *= exchangeRate;
      } else if (selectedCurrency === "USD") {
        subtotal /= exchangeRate;
        discount /= exchangeRate;
        total /= exchangeRate;
      }

      subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
      discountElement.innerText = `- $${discount.toFixed(2)}`;
      totalElement.innerText = `$${total.toFixed(2)}`;
    })
    .catch((error) => {
      console.error("Error al obtener la tasa de cambio:", error);
    });
});

// mostrar los contenedores
document.addEventListener("DOMContentLoaded", function () {
  const currencySelect = document.getElementById("divisas");
  const paypalContainer = document.getElementById("paypal-button-container");
  const mercadoPagoContainer = document.getElementById("container-pagar");

  // Mostrar los contenedores según la selección inicial
  showContainers();

  // Escuchar cambios en la selección de divisas
  currencySelect.addEventListener("change", function () {
    showContainers();
  });

  function showContainers() {
    const selectedCurrency = currencySelect.value;

    if (selectedCurrency === "USD") {
      paypalContainer.style.display = "block";
      mercadoPagoContainer.style.display = "none";
    } else if (selectedCurrency === "ARS") {
      paypalContainer.style.display = "none";
      mercadoPagoContainer.style.display = "block";
    }
  }
});

// Funciones para mostrar y ocultar el loader
function showLoader() {
  document.getElementById("loader").style.display = "flex";
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
}

//vaciar carrito
async function emptyCart() {
  try {
    const response = await fetch("/api/cart/deleteAfterPayment", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("Carrito vaciado con éxito");
    } else {
      console.error("Error al vaciar el carrito");
    }
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
  }
}