import { Router } from "express";
import { CategoriaController } from "../controllers/categoria.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createCategoriaSchema, updateCategoriaSchema } from "../dtos/categoria.dto";

export class CategoriaRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new CategoriaController();

    // Rutas
    // localhost:3000/categoria/
    router.get("/", asyncHandler(controller.listar));
    router.get("/:id", asyncHandler(controller.obtenerPorId));

    router.post(
      "/",
      validateRequest(createCategoriaSchema),
      asyncHandler(controller.crear)
    );

    router.put(
      "/:id",
      validateRequest(updateCategoriaSchema),
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
