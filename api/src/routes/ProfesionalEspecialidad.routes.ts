import { Router } from "express";
import { ProfesionalEspecialidadController } from "../controllers/profesionalEspecialidad.controller";

export class ProfesionalEspecialidadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ProfesionalEspecialidadController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}