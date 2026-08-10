import { Router } from "express";
import { PerfilProfesionalController } from "../controllers/perfilProfesional.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createPerfilProfesionalSchema, updatePerfilProfesionalSchema } from "../dtos/perfilProfesional.dto";

export class PerfilProfesionalRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new PerfilProfesionalController();

    // Rutas
    // localhost:3000/perfilProfesional/
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));

    router.post(
      "/",
      validateRequest(createPerfilProfesionalSchema),
      asyncHandler(controller.crear)
    );

    router.put(
      "/:id",
      validateRequest(updatePerfilProfesionalSchema),
      asyncHandler(controller.actualizar)
    );

    router.patch(
      "/:id/disponibilidad",
      asyncHandler(controller.cambiarDisponibilidad)
    );

    return router;
  }
}