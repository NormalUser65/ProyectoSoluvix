import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { citaService } from "../services/cita.service";
import { sendSuccess } from "../utils/http-response";
import { parseId } from "../utils/parse-id";

export class CitaController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const citas = await citaService.listar();
    return sendSuccess(response, citas);
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const cita = await citaService.obtenerPorId(id);
    return sendSuccess(response, cita);
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    const cita = await citaService.crear(request.body);
    return sendSuccess(response, cita, "Cita registrada correctamente", StatusCodes.CREATED);
  };

  actualizar = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const cita = await citaService.actualizar(id, request.body);
    return sendSuccess(response, cita, "Cita actualizada correctamente");
  };

  filtrarPorEstado = async (request: Request, response: Response, next: NextFunction) => {
    const idEstado = parseId(request.query.idEstado as string);
    const citas = await citaService.filtrarPorEstado(idEstado);
    return sendSuccess(response, citas);
  };

  filtrarPorProfesional = async (request: Request, response: Response, next: NextFunction) => {
    const idProfesional = parseId(request.query.idProfesional as string);
    const citas = await citaService.filtrarPorProfesional(idProfesional);
    return sendSuccess(response, citas);
  };

  filtrarPorRangoFechas = async (request: Request, response: Response, next: NextFunction) => {
    const { fechaInicio, fechaFin } = request.query;
    const citas = await citaService.filtrarPorRangoFechas(
      new Date(String(fechaInicio)),
      new Date(String(fechaFin))
    );
    return sendSuccess(response, citas);
  };
}
