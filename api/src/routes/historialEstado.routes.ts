import { Router } from "express";
import { HistorialEstadoCitaController } from "../controllers/historialEstadoCita.controller";

export class HistorialEstadoRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new HistorialEstadoCitaController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}