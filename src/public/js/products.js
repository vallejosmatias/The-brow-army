// Ejemplo de tasa de cambio fija (1 USD = 100 ARS)
const exchangeRate = 100;


document.addEventListener("DOMContentLoaded", () => {
    const addToOrderButtons = document.querySelectorAll(".add-to-order-btn");
    const orderList = document.querySelector(".order-list");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const aside = document.querySelector(".order-aside");
    const openAsideBtn = document.querySelector(".open-aside-btn");
    const closeAsideBtn = document.querySelector(".close-aside-btn");
    const currencySelect = document.getElementById("divisas");

    const orderItems = {};

    addToOrderButtons.forEach(button => {
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
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No hay suficiente stock disponible para este producto!',
                    });
                }
            } else {
                orderItems[productName] = {
                    name: productName,
                    price: productPrice,
                    imgUrl: productImgUrl,
                    quantity: 1,
                    stock: productStock
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
            return;
        }
    
        let totalUSD = 0;
        let totalARS = 0;
        const currency = currencySelect.value;
    
        for (let productName of orderItemKeys) {
            const item = orderItems[productName];
            let price = item.price;
            
            // Convertir el precio a ARS si la moneda seleccionada es ARS
            if (currency === 'ARS') {
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
            if (currency === 'USD') {
                totalUSD += item.quantity * item.price;
            } else if (currency === 'ARS') {
                totalARS += item.quantity * item.price * exchangeRate;
            }
        }
    
        let total = currency === 'USD' ? totalUSD.toFixed(2) : totalARS.toFixed(2);
    
        // Mostrar u ocultar el botón de realizar pedido
        if (orderItemKeys.length > 0) {
            placeOrderBtn.classList.remove("hide");
        } else {
            placeOrderBtn.classList.add("hide");
        }
    }

    // Event listener para abrir el aside
    openAsideBtn.addEventListener("click", () => {
        aside.classList.add("open");
    });

    // Event listener para cerrar el aside
    closeAsideBtn.addEventListener("click", () => {
        aside.classList.remove("open");
    });

    // Event listener para realizar el pedido
    placeOrderBtn.addEventListener("click", () => {
        let orderText = 'Pedido:\n';
        let totalUSD = 0;
        let totalARS = 0;
        const currency = currencySelect.value;
    
        for (let productName in orderItems) {
            const item = orderItems[productName];
            let price = item.price;
    
            // Convertir el precio a ARS si la moneda seleccionada es ARS
            if (currency === 'ARS') {
                price *= exchangeRate;
            }
    
            orderText += `${item.name} - ${item.quantity} x $${price.toFixed(2)} ${currency}\n`;
    
            // Calcular totales en USD y ARS
            if (currency === 'USD') {
                totalUSD += item.quantity * item.price;
            } else if (currency === 'ARS') {
                totalARS += item.quantity * item.price * exchangeRate;
            }
        }
    
        let total = currency === 'USD' ? totalUSD.toFixed(2) : totalARS.toFixed(2);
    
        orderText += `\nTotal: $${total} ${currency}`;
    
        const whatsappUrl = `https://api.whatsapp.com/send?phone=1234567890&text=${encodeURIComponent(orderText)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Event listener para los botones de eliminar producto
    orderList.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-item-btn")) {
            const productName = event.target.getAttribute("data-name");
            if (orderItems[productName].quantity > 1) {
                orderItems[productName].quantity -= 1;
            } else {
                delete orderItems[productName];
            }
            updateOrderList();
        }
    });
});
