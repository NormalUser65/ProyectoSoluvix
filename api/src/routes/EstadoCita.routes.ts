import { Router } from "express";
import { EstadoCitaController } from "../controllers/estadoCita.controller";

export class EstadoCitaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new EstadoCitaController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}