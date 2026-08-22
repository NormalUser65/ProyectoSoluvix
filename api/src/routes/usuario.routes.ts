import { Router } from "express";
import { UsuarioController } from "../controllers/usuario.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { authenticateToken } from "../middlewares/authMiddleware";

import {
  createUsuarioSchema,
  updateUsuarioSchema,
  registerUserSchema,
  loginUserSchema
} from "../dtos/usuario.dto";

export class UsuarioRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new UsuarioController();

    // ==========================================
    // Rutas de usuario
    // ==========================================

    // GET /usuario/
    router.get(
      "/",
      asyncHandler(controller.listar)
    );

    // POST /usuario/
    router.post(
      "/",
      validateRequest(createUsuarioSchema),
      asyncHandler(controller.crear)
    );

    // POST /usuario/register
    router.post(
      "/register",
      validateRequest(registerUserSchema),
      asyncHandler(controller.registrar)
    );

    // POST /usuario/login
    router.post(
      "/login",
      validateRequest(loginUserSchema),
      asyncHandler(controller.login)
    );

    // GET /usuario/perfil
    // Requiere JWT
    router.get(
      "/perfil",
      authenticateToken,
      asyncHandler(controller.perfil)
    );

    // GET /usuario/:id
    router.get(
      "/:id",
      asyncHandler(controller.obtenerPorId)
    );

    // PUT /usuario/:id
    router.put(
      "/:id",
      validateRequest(updateUsuarioSchema),
      asyncHandler(controller.actualizar)
    );

    // PATCH /usuario/:id/estado
    router.patch(
      "/:id/estado",
      asyncHandler(controller.cambiarEstado)
    );

    console.log("UsuarioRoutes cargadas - /register disponible");
    return router;
  }
}