import { Router } from "express";
import { ServicioEspecialidadController } from "../controllers/servicioEspecialidad.controller";
import { servicioEspecialidadService } from "../services/servicioEspecialidad.service";

export class ServicioEspecialidadRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ServicioEspecialidadController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}