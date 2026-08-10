import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { servicioEspecialidadService } from "../services/servicioEspecialidad.service";

export class ServicioEspecialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const relaciones = await servicioEspecialidadService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: relaciones,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const relacion = await servicioEspecialidadService.obtenerPorId(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: relacion,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}