import Servicio from "../models/servicios.model.js";

export const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.render("servicios", {
      title: "Servicios",
      showNavbarFooter: true,
      servicios,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createServicio = async (req, res) => {
  const { nombre, descripcion, imgUrl, precio, duracion } = req.body;

  const nuevoServicio = new Servicio({
    nombre,
    descripcion,
    imgUrl,
    precio,
    duracion,
  });

  try {
    const servicioGuardado = await nuevoServicio.save();
    res.redirect("/admin/courses");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateServicio = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, imgUrl, precio, duracion } = req.body;

  try {
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { nombre, descripcion, imgUrl, precio, duracion },
      { new: true }
    );

    if (!servicioActualizado) {
      return res
        .status(404)
        .json({ success: false, message: "Servicio no encontrado" });
    }

    res.redirect("/admin/courses");
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteServicio = async (req, res) => {
  try {
    await Servicio.findByIdAndDelete(req.params.id);
    res.redirect("/admin/courses");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
