import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { estadoCitaService } from "../services/EstadoCita.Service";

export class EstadoCitaController {

    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const estados = await estadoCitaService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: estados
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const estado = await estadoCitaService.obtenerPorId(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: estado
            });

        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}