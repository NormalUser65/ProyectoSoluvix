import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { resenaService } from "../services/resena.service";

export class ResenaController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const resenas = await resenaService.listar();

            return response.status(StatusCodes.OK).json({
                success: true,
                data: resenas,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const id = Number(request.params.id);

            const resena = await resenaService.obtenerPorId(id);

            return response.status(StatusCodes.OK).json({
                success: true,
                data: resena,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}