import { Router } from "express";
import { ResenaController } from "../controllers/resena.controller";

export class ResennaRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ResenaController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}