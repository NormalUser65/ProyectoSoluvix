import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createUsuarioSchema, updateUsuarioSchema, registerUserSchema, loginUserSchema } from "../dtos/usuario.dto";

export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UsuarioController();

    // Rutas
    // localhost:3000/usuario/
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));

    router.post(
      "/",
      validateRequest(createUsuarioSchema),
      asyncHandler(controller.crear)
    );

    router.put(
      "/:id",
      validateRequest(updateUsuarioSchema),
      asyncHandler(controller.actualizar)
    );

    router.patch(
      "/:id/estado",
      asyncHandler(controller.cambiarEstado)
    );

    return router;
  }
}