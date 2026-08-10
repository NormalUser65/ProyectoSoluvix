import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { servicioService } from "../services/servicio.service";
import { sendSuccess } from "../utils/http-response";
import { parseId } from "../utils/parse-id";

export class ServicioController {
    listar = async (request: Request, response: Response, next: NextFunction) => {
        const servicios = await servicioService.listar();
        return sendSuccess(response, servicios);
    };

    obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const servicio = await servicioService.obtenerPorId(id);
        return sendSuccess(response, servicio);
    };

    crear = async (request: Request, response: Response, next: NextFunction) => {
        const servicio = await servicioService.crear(request.body);
        return sendSuccess(response, servicio, "Servicio creado correctamente", StatusCodes.CREATED);
    };
    
    actualizar = async (request: Request, response: Response, next: NextFunction) => {
        const id = parseId(request.params.id);
        const servicio = await servicioService.actualizar(id, request.body);
        return sendSuccess(response, servicio, "Servicio actualizado correctamente");
    };
}