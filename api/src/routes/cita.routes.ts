import { Router } from "express";
import { CitaController } from "../controllers/cita.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createCitaSchema, updateCitaSchema } from "../dtos/cita.dto";

export class CitaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CitaController();

    // Listar citas
    router.get(
      "/",
      asyncHandler(controller.listar)
    );

    // Filtros
    router.get(
      "/filtrar/estado",
      asyncHandler(controller.filtrarPorEstado)
    );

    router.get(
      "/filtrar/profesional",
      asyncHandler(controller.filtrarPorProfesional)
    );

    router.get(
      "/filtrar/rango-fechas",
      asyncHandler(controller.filtrarPorRangoFechas)
    );

    // Obtener una cita por ID
    router.get(
      "/:id",
      asyncHandler(controller.obtenerPorId)
    );

    // Crear cita
    router.post(
      "/",
      validateRequest(createCitaSchema),
      asyncHandler(controller.crear)
    );

    // Actualizar cita
    router.put(
      "/:id",
      validateRequest(updateCitaSchema),
      asyncHandler(controller.actualizar)
    );

    return router;
  }
}