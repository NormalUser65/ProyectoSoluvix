import { Router } from "express";
import { CitaController } from "../controllers/cita.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import {
  createCitaSchema,
  updateCitaSchema,
  aceptarCitaSchema,
  rechazarCitaSchema,
  cancelarCitaSchema,
  completarCitaSchema,
} from "../dtos/cita.dto";
import { authenticateToken } from "../middlewares/authMiddleware";

export class CitaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CitaController();

    // Listar citas
    router.get("/", asyncHandler(controller.listar));

    // Filtros
    router.get("/filtrar/estado", asyncHandler(controller.filtrarPorEstado));
    router.get("/filtrar/profesional", asyncHandler(controller.filtrarPorProfesional));
    router.get("/filtrar/rango-fechas", asyncHandler(controller.filtrarPorRangoFechas));

    // Historial del cliente autenticado
    router.get(
      "/mis-citas",
      authenticateToken,
      asyncHandler(controller.listarMisCitas)
    );

    
    router.get("/mis-citas/:id", authenticateToken, asyncHandler(controller.obtenerMiCitaPorId));

    // Obtener una cita por ID
    router.get("/:id", asyncHandler(controller.obtenerPorId));

    // Crear cita
    router.post("/", authenticateToken, validateRequest(createCitaSchema), asyncHandler(controller.crear));

    // Actualizar cita
    router.put("/:id", validateRequest(updateCitaSchema), asyncHandler(controller.actualizar));

    // Nuevas rutas para cambios de estado
    router.post("/:id/aceptar", validateRequest(aceptarCitaSchema), asyncHandler(controller.aceptar));
    router.post("/:id/rechazar", validateRequest(rechazarCitaSchema), asyncHandler(controller.rechazar));
    router.post("/:id/cancelar", validateRequest(cancelarCitaSchema), asyncHandler(controller.cancelar));
    router.post("/:id/completar", validateRequest(completarCitaSchema), asyncHandler(controller.completar));

    return router;
  }
}
