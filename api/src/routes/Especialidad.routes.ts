import { Router } from "express";
import { EspecialidadController } from "../controllers/especialidad.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createEspecialidadSchema, updateEspecialidadSchema } from "../dtos/especialidad.dto";

export class EspecialidadRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new EspecialidadController();

    // Rutas
    // localhost:3000/especialidad/
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));

    router.post(
      "/",
      validateRequest(createEspecialidadSchema),
      asyncHandler(controller.crear)
    );

    router.put(
      "/:id",
      validateRequest(updateEspecialidadSchema),
      asyncHandler(controller.actualizar)
    );

    router.patch(
      "/:id/estado",
      asyncHandler(controller.cambiarEstado)
    );

    router.get("/buscar/nombre", asyncHandler(controller.buscarPorNombre));

    router.get("/filtrar/estado", asyncHandler(controller.filtrarPorEstado));

    return router;
  }
}