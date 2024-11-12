document.addEventListener("DOMContentLoaded", () => {
  const addToOrderButtons = document.querySelectorAll(".add-to-order-btn");
  const orderList = document.querySelector(".order-list");
  const placeOrderBtn = document.getElementById("place-order-btn");
  const aside = document.querySelector(".order-aside");
  const openAsideBtn = document.querySelector(".open-aside-btn");
  const closeAsideBtn = document.querySelector(".close-aside-btn");
  const currencySelect = document.getElementById("divisas");

  let exchangeRate = 1400; // Tasa de cambio inicial (por defecto 1)

  // Función para obtener la tasa de cambio desde el servidor
  async function fetchExchangeRate() {
    try {
      const response = await fetch('/admin/exchange-rate'); // Ruta para obtener la tasa de cambio
      if (!response.ok) {
        throw new Error('Error al obtener la tasa de cambio');
      }
      const data = await response.json();
      
      // Verifica si data.rate es un número válido
      if (typeof data.rate !== 'number' || isNaN(data.rate)) {
        throw new Error('La tasa de cambio recibida no es un número válido');
      }
      
      exchangeRate = data.rate;
      updateProductPrices();
      updateOrderList();
    } catch (error) {
      console.error('Error:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  }

  // Llamar a la función para obtener la tasa de cambio al cargar la página
  fetchExchangeRate();

  const orderItems = {};

  addToOrderButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.getAttribute("data-name");
      const productPrice = parseFloat(button.getAttribute("data-price"));
      const productImgUrl = button.getAttribute("data-imgurl");
      const productStock = parseInt(button.getAttribute("data-stock"), 10);

      if (orderItems[productName]) {
        if (orderItems[productName].quantity < productStock) {
          orderItems[productName].quantity += 1;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No hay suficiente stock disponible para este producto!",
          });
        }
      } else {
        orderItems[productName] = {
          name: productName,
          price: productPrice,
          imgUrl: productImgUrl,
          quantity: 1,
          stock: productStock,
        };
      }

      updateOrderList();
    });
  });

  function updateOrderList() {
    orderList.innerHTML = "";

    const orderItemKeys = Object.keys(orderItems);

    if (orderItemKeys.length === 0) {
      orderList.innerHTML = "<p>No agregaste nada al carrito</p>";
      aside.classList.remove("open");
      document.getElementById("order-total").textContent = "$0.00 USD";
      return;
    }

    let totalUSD = 0;
    let totalARS = 0;
    const currency = currencySelect.value;

    for (let productName of orderItemKeys) {
      const item = orderItems[productName];
      let price = item.price;

      // Convertir el precio a ARS si la moneda seleccionada es ARS
      if (currency === "ARS") {
        price *= exchangeRate;
      }

      const listItem = document.createElement("li");

      listItem.innerHTML = `
                <div class="order-item">
                    <img src="${item.imgUrl}" alt="${item.name}" class="order-item-img">
                    <div class="order-item-details">
                        <p class="order-item-name">${item.name}</p>
                        <p class="order-item-price">$${price.toFixed(2)} ${currency}</p>
                        <p class="order-item-quantity">Unid: ${item.quantity}</p>
                        <button class="delete-item-btn" data-name="${item.name}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(245, 245, 245, 1);transform: ;msFilter:;">
                                <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
      orderList.appendChild(listItem);

      // Calcular totales en USD y ARS
      if (currency === "USD") {
        totalUSD += item.quantity * item.price;
      } else if (currency === "ARS") {
        totalARS += item.quantity * item.price * exchangeRate;
      }
    }

    const total = currency === "USD" ? totalUSD.toFixed(2) : totalARS.toFixed(2);
    const totalText = currency === "USD" ? `${total} USD` : `${total} ARS`;

    // Mostrar el total en el aside
    document.getElementById("order-total").textContent = `Total: ${totalText}`;

    // Mostrar u ocultar el botón de realizar pedido
    if (orderItemKeys.length > 0) {
      placeOrderBtn.classList.remove("hide");
    } else {
      placeOrderBtn.classList.add("hide");
    }

    // Agregar eventos para los botones de eliminar
    const deleteButtons = document.querySelectorAll(".delete-item-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productName = button.getAttribute("data-name");
        if (orderItems[productName].quantity > 1) {
          orderItems[productName].quantity -= 1;
        } else {
          delete orderItems[productName];
        }
        updateOrderList();
      });
    });

    // Mostrar el aside
    aside.classList.add("open");
  }

  // Event listener for opening the aside
  openAsideBtn.addEventListener("click", () => {
    aside.classList.add("open");
  });

  // Event listener for closing the aside
  closeAsideBtn.addEventListener("click", () => {
    aside.classList.remove("open");
  });

  // Función para actualizar los precios de las tarjetas
  function updateProductPrices() {
    const cards = document.querySelectorAll(".card");
    const currency = currencySelect.value;

    cards.forEach((card) => {
      const priceElement = card.querySelector(".product-price");
      let price = parseFloat(card.getAttribute("data-price"));

      if (currency === "ARS") {
        price *= exchangeRate;
      }

      priceElement.textContent = `Precio: $${price.toFixed(2)}`;
    });
  }

  // Evento para detectar el cambio de moneda y actualizar los precios
  currencySelect.addEventListener("change", () => {
    fetchExchangeRate(); // Llamar a fetchExchangeRate nuevamente al cambiar la moneda
  });

  // Inicializar los precios de las tarjetas y el pedido
  updateProductPrices();
  updateOrderList();

  placeOrderBtn.addEventListener("click", () => {
    let orderText = "Pedido:\n";
    const currency = currencySelect.value;

    for (let productName in orderItems) {
      const item = orderItems[productName];
      let price = item.price;

      // Convertir el precio a ARS si la moneda seleccionada es ARS
      if (currency === "ARS") {
        price *= exchangeRate;
      }

      orderText += `${item.name} - $${price.toFixed(2)} ${currency} x ${item.quantity}\n`;
    }

    const totalText = document.getElementById("order-total").textContent;
    orderText += `\n${totalText}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5491123160671&text=${encodeURIComponent(orderText)}`;
    window.open(whatsappUrl, "_blank");

    // Limpiar el aside después de realizar el pedido
    clearOrder();
  });

  function clearOrder() {
    // Vaciar el objeto orderItems
    for (let key in orderItems) {
      delete orderItems[key];
    }

    // Limpiar el contenido del aside y ocultarlo
    orderList.innerHTML = "";
    document.getElementById("order-total").textContent = "$0.00 USD";
    placeOrderBtn.classList.add("hide");
    aside.classList.remove("open");
  }
});
