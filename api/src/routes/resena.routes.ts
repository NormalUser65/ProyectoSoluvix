import { Router } from "express";
import { ResenaController } from "../controllers/resena.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createResenaSchema } from "../dtos/resena.dto";

export class ResenaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ResenaController();

    router.get("/", asyncHandler(controller.listar));

    router.get("/:id", asyncHandler(controller.obtenerPorId));

    router.get("/profesional/:idProfesional", asyncHandler(controller.obtenerPorProfesional));

    router.get("/cita/:idCita", asyncHandler(controller.obtenerPorCita));

    router.post("/", validateRequest(createResenaSchema), asyncHandler(controller.crear));

    return router;
  }
}