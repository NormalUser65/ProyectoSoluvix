import { Router } from "express";
import { ReporteController } from "../controllers/reporte.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { authenticateToken } from "../middlewares/authMiddleware";

export class ReporteRoutes {
  static get routes(): Router {
    const router = Router();
    const controller = new ReporteController();

    // Reporte de citas por estado (público - sin autenticación)
    router.get(
      "/citas/estado",
      asyncHandler(controller.obtenerCitasPorEstado)
    );

    // Reporte de citas por profesional (requiere autenticación)
    router.get(
      "/citas/profesional",
      authenticateToken,  // 👈 Agregar
      asyncHandler(controller.obtenerCitasPorProfesional)
    );

    // Reporte de calificaciones (requiere autenticación)
    router.get(
      "/calificaciones",
      authenticateToken,  // 👈 Agregar
      asyncHandler(controller.obtenerCalificaciones)
    );

    return router;
  }
}