import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { especialidadService } from "../services/Especialidad.Service";
import { sendSuccess } from "../utils/http-response";
import { parseId } from "../utils/parse-id";

export class EspecialidadController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const especialidades = await especialidadService.listar();
    return sendSuccess(response, especialidades);
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const especialidad = await especialidadService.obtenerPorId(id);
    return sendSuccess(response, especialidad);
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    const especialidad = await especialidadService.crear(request.body);
    return sendSuccess(response, especialidad, "Especialidad creada correctamente", StatusCodes.CREATED);
  };

  actualizar = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const especialidad = await especialidadService.actualizar(id, request.body);
    return sendSuccess(response, especialidad, "Especialidad actualizada correctamente");
  };

  cambiarEstado = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const { estado } = request.body;
    const especialidad = await especialidadService.cambiarEstado(id, estado);
    return sendSuccess(response, especialidad, "Estado de especialidad actualizado correctamente");
  };

  buscarPorNombre = async (request: Request, response: Response, next: NextFunction) => {
    const { nombre } = request.query;
    const especialidades = await especialidadService.buscarPorNombre(String(nombre));
    return sendSuccess(response, especialidades);
  };

  filtrarPorEstado = async (request: Request, response: Response, next: NextFunction) => {
    const { estado } = request.query;
    const especialidades = await especialidadService.filtrarPorEstado(estado === "true");
    return sendSuccess(response, especialidades);
  };
}
