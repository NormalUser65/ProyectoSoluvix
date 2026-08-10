import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { profesionalEspecialidadService } from "../services/profesionalEspecialidad.service";

export class ProfesionalEspecialidadController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const relaciones = await profesionalEspecialidadService.listar();

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

            const relacion = await profesionalEspecialidadService.obtenerPorId(id);

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