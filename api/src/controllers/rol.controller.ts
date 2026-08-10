import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { rolService } from "../services/Rol.Service";

export class RolController {

    listar = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const roles = await rolService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: roles
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const id = Number(request.params.id);

            const rol = await rolService.obtenerPorId(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: rol
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}