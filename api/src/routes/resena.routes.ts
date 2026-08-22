import { Router } from "express";
import { ResenaController } from "../controllers/resena.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createResenaSchema } from "../dtos/resena.dto";

export class ResenaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ResenaController();

    // Listar reseñas
    router.get("/", asyncHandler(controller.listar));

    // Obtener reseña por id
    router.get("/:id", asyncHandler(controller.obtenerPorId));

    // Crear reseña
    router.post("/", validateRequest(createResenaSchema), asyncHandler(controller.crear));

    return router;
  }
}
