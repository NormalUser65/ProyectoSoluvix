import { Router } from "express";
import { ModalidadController } from "../controllers/modalidad.controller";

export class ModalidadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ModalidadController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}