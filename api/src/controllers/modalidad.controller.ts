import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { modalidadService } from "../services/Modalidad.Service";

export class ModalidadController {

    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const modalidades = await modalidadService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: modalidades
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const modalidad = await modalidadService.obtenerPorId(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: modalidad
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}