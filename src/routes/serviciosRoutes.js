import {Router} from 'express';
import { getServicios, createServicio, updateServicio, deleteServicio } from '../controllers/serviciosController.js';
import Servicio from '../models/servicios.model.js';

const router = Router();

router.get('/servicios', getServicios);
router.post('/new-Servicio', createServicio);
router.post('/servicio-update/:id', updateServicio);
router.get('/servicio-delete/:id', deleteServicio);

// Curso individual
router.get("/service/:id", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const service = await Servicio.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Curso no encontrado" });
      }
      res.render("servicio", {
        service: service,
        title: "Servicio",
        showNavbarFooter: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Error del servidor", error });
    }
  });

export default router;
