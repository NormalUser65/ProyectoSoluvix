import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { perfilProfesionalService } from "../services/perfilProfesional.service";
import { sendSuccess } from "../utils/http-response"; 
import { parseId } from "../utils/parse-id";

export class PerfilProfesionalController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const perfiles = await perfilProfesionalService.listar();
    return sendSuccess(response, perfiles);
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const perfil = await perfilProfesionalService.obtenerPorId(id);
    return sendSuccess(response, perfil);
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    const perfil = await perfilProfesionalService.crear(request.body);
    return sendSuccess(response, perfil, "Perfil profesional creado correctamente", StatusCodes.CREATED);
  };

  actualizar = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const perfil = await perfilProfesionalService.actualizar(id, request.body);
    return sendSuccess(response, perfil, "Perfil profesional actualizado correctamente");
  };

  cambiarDisponibilidad = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const { disponible } = request.body;
    const perfil = await perfilProfesionalService.cambiarDisponibilidad(id, disponible);
    return sendSuccess(response, perfil, "Disponibilidad del perfil actualizada correctamente");
  };
}