import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { historialEstadoCitaService } from "../services/historialEstadoCita.service";

export class HistorialEstadoCitaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const historial = await historialEstadoCitaService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: historial,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const registro = await historialEstadoCitaService.obtenerPorId(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: registro,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}