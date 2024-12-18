document.addEventListener("DOMContentLoaded", () => {
  const editButtons = document.querySelectorAll(".edit-course-btn");
  const modal = document.getElementById("editCourseModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const editForm = document.getElementById("editCourseForm");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const courseId = button.getAttribute("data-id");
      const courseTitle = button.getAttribute("data-title");
      const courseDescription = button.getAttribute("data-description");
      const coursePrice = button.getAttribute("data-price");
      const courseImgUrl = button.getAttribute("data-imgurl");
      const courseVideoUrl = button.getAttribute("data-videourl");

      document.getElementById("edit-course-id").value = courseId;
      document.getElementById("edit-title").value = courseTitle;
      document.getElementById("edit-description").value = courseDescription;
      document.getElementById("edit-price").value = coursePrice;
      document.getElementById("edit-imgUrl").value = courseImgUrl;
      document.getElementById("edit-videoUrl").value = courseVideoUrl;

      modal.style.display = "block";
      editForm.action = `/admin/courses/edit/${courseId}`;
    });
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

// Manejo de códigos de descuento
document.addEventListener("DOMContentLoaded", () => {
  const discountCodeForm = document.getElementById("discountCodeForm");
  const discountCodesList = document.getElementById("discountCodesList");

  if (discountCodeForm && discountCodesList) {
    // Event listener para el formulario de creación de código de descuento
    discountCodeForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Evitar el envío por defecto del formulario

      const codeInput = document.getElementById("code");
      const discountPercentageInput =
        document.getElementById("discountPercentage");

      const code = codeInput.value;
      const discountPercentage = discountPercentageInput.value;

      try {
        // Enviar datos al servidor para crear el código de descuento
        const response = await fetch("/admin/discount-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code, discountPercentage }),
        });

        if (!response.ok) {
          throw new Error("Error al crear el código de descuento.");
        }

        const newDiscountCode = await response.json();

        Toastify({
          text: "Descuento creado",
          offset: {
            x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 20, // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
          duration: 2000,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "rgb(76, 175, 80)",
          },
        }).showToast();

        // Añadir el nuevo código de descuento a la lista en el DOM
        const newDiscountCodeElement = document.createElement("div");
        newDiscountCodeElement.classList.add("discount-code");
        newDiscountCodeElement.innerHTML = `
         <p>${newDiscountCode.code} - ${newDiscountCode.discountPercentage}%</p>
         <button class="deleteButton" data-id="${newDiscountCode._id}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgb(255, 255, 255);transform: ;msFilter:;"><path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm4 12H8v-9h2v9zm6 0h-2v-9h2v9zm.618-15L15 2H9L7.382 4H3v2h18V4z"></path></svg></button>
       `;
        discountCodesList.appendChild(newDiscountCodeElement);

        // Limpiar el formulario
        codeInput.value = "";
        discountPercentageInput.value = "";
      } catch (error) {
        console.error("Error al crear el código de descuento:", error);
        // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
        // SweetAlert para errores
        Swal.fire({
          title: "Error",
          text: "Error al crear el código de descuento. Inténtalo de nuevo.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    });

    // Event listener para eliminar códigos de descuento existentes
    discountCodesList.addEventListener("click", async (event) => {
      if (event.target.classList.contains("deleteButton")) {
        const discountCodeId = event.target.dataset.id;

        try {
          // Enviar solicitud al servidor para eliminar el código de descuento
          const response = await fetch(
            `/admin/discount-codes/${discountCodeId}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            throw new Error("Error al eliminar el código de descuento.");
          }

          // Remover el elemento del DOM
          event.target.parentNode.remove();

          Toastify({
            text: "Descuento Eliminado",
            offset: {
              x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
              y: 20, // vertical axis - can be a number or a string indicating unity. eg: '2em'
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
        } catch (error) {
          console.error("Error al eliminar el código de descuento:", error);
          // Manejar el error (por ejemplo, mostrar un mensaje al usuario)
        }
      }
    });
  } else {
    console.error("No se encontraron los elementos necesarios en el DOM.");
  }
});

// agregar curso al usaurio
document
  .getElementById("confirmTransferForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value;
    const courseId = document.getElementById("courseId").value;

    const response = await fetch("/admin/confirm-transfer-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseId }),
    });

    const result = await response.text();
    if (response.ok) {
      Swal.fire({
        title: `${result}`,
        icon: "succes"
      });
    } else {
      Swal.fire({
        title: `${result}`,
        icon: "error"
      });
    }
  });

// mostrar los cursos del usuario
document.addEventListener("DOMContentLoaded", () => {
  async function loadUserCourses() {
    const userId = document.getElementById("deleteUserId").value;
    const response = await fetch(`/admin/getUserCourses/${userId}`);
    const courses = await response.json();

    const courseSelect = document.getElementById("deleteCourseId");
    courseSelect.innerHTML = "";

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = course.title;
      courseSelect.appendChild(option);
    });
  }

  document
    .getElementById("deleteUserId")
    .addEventListener("change", loadUserCourses);
});

// Eliminar curso del usuario
document
  .getElementById("delete-course")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.getElementById("deleteUserId").value;
    const courseId = document.getElementById("deleteCourseId").value;

    const response = await fetch("/admin/delete-course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseId }),
    });

    const result = await response.text();
    if (response.ok) {
      Swal.fire({
        title: `${result}`,
        icon: "succes"
      });
      setTimeout(() => {
        // Redireccionar al home si el inicio de sesión es exitoso
        window.location.reload();
      }, 2000);
    } else {
      Swal.fire({
        title: `${result}`,
        icon: "error"
      });
    }
  });


  // modal
  document.addEventListener("DOMContentLoaded", () => {
    const editProductButtons = document.querySelectorAll(".edit-product-btn");
    const productModal = document.getElementById("editProductModal");
    const closeProductModalBtn = document.getElementById("closeProductModalBtn");
    const editProductForm = document.getElementById("editProductForm");
  
    editProductButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.getAttribute("data-id");
        const productName = button.getAttribute("data-name");
        const productDescription = button.getAttribute("data-description");
        const productStock = button.getAttribute("data-stock");
        const productPrice = button.getAttribute("data-price");
        const productImgUrl = button.getAttribute("data-imgurl");
        const productCategory = button.getAttribute("data-category");
  
        document.getElementById("edit-product-id").value = productId;
        document.getElementById("edit-product-name").value = productName;
        document.getElementById("edit-product-description").value = productDescription;
        document.getElementById("edit-product-price").value = productPrice;
        document.getElementById("edit-product-imgUrl").value = productImgUrl;
        document.getElementById("edit-product-category").value = productCategory;
        document.getElementById("edit-stock").value = productStock;
  
        productModal.style.display = "block";
        editProductForm.action = `/admin/products/edit/${productId}`;
      });
    });
  
    closeProductModalBtn.addEventListener("click", () => {
      productModal.style.display = "none";
    });
  
    window.addEventListener("click", (e) => {
      if (e.target === productModal) {
        productModal.style.display = "none";
      }
    });
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    const exchangeRateForm = document.getElementById("exchangeRateForm");
    const exchangeRateInput = document.getElementById("exchangeRate");
  
    if (exchangeRateForm) {
      // Cargar la cotización actual al cargar la página
      async function loadExchangeRate() {
        try {
          const response = await fetch("/admin/exchange-rate");
          const rate = await response.json();
          exchangeRateInput.value = rate ? rate.rate : "";
        } catch (error) {
          console.error("Error al cargar la cotización:", error);
        }
      }
  
      loadExchangeRate();
  
      // Manejar la actualización de la cotización
      exchangeRateForm.addEventListener("submit", async (event) => {
        event.preventDefault();
  
        const rate = exchangeRateInput.value;
  
        try {
          const response = await fetch("/admin/exchange-rate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rate }),
          });
  
          if (!response.ok) {
            throw new Error("Error al actualizar la cotización.");
          }
  
          Toastify({
            text: "Cotización actualizada",
            offset: {
              x: 0,
              y: 20,
            },
            duration: 2000,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "rgb(76, 175, 80)",
            },
          }).showToast();
        } catch (error) {
          console.error("Error al actualizar la cotización:", error);
          Swal.fire({
            title: "Error",
            text: "Error al actualizar la cotización. Inténtalo de nuevo.",
            icon: "error",
            confirmButtonText: "Aceptar",
          });
        }
      });
    }
  });

// Modal de servicios
document.addEventListener("DOMContentLoaded", () => {
const editServiceButtons = document.querySelectorAll(".edit-service-btn");
const serviceModal = document.getElementById("editServiceModal");
const closeServiceModalBtn = document.getElementById("closeServiceModalBtn");
const editServiceForm = document.getElementById("editServiceForm");

editServiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const serviceId = button.getAttribute("data-id");
    const serviceName = button.getAttribute("data-name");
    const serviceDescription = button.getAttribute("data-description");
    const servicePrice = button.getAttribute("data-price");
    const serviceDuration = button.getAttribute("data-duration");
    const serviceImgUrl = button.getAttribute("data-imgurl");

    document.getElementById("edit-service-id").value = serviceId;
    document.getElementById("edit-service-name").value = serviceName;
    document.getElementById("edit-service-description").value = serviceDescription;
    document.getElementById("edit-service-price").value = servicePrice;
    document.getElementById("edit-service-duration").value = serviceDuration;
    document.getElementById("edit-service-imgUrl").value = serviceImgUrl;

    serviceModal.style.display = "block";
    editServiceForm.action = `/servicio-update/${serviceId}`;
  });
});

closeServiceModalBtn.addEventListener("click", () => {
  serviceModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === serviceModal) {
    serviceModal.style.display = "none";
  }
});
});