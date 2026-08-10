import { Router } from "express";
import { RolController } from "../controllers/rol.controller";

export class RolRouts {
    static get routes(): Router {
        const router = Router();
        const controller = new RolController();

        router.get("/", controller.listar);
        router.get("/:id", controller.obtenerPorId);

        return router;
    }
}