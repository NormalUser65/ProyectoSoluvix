import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { citaService } from "../services/cita.service";
import { sendSuccess } from "../utils/http-response";
import { parseId } from "../utils/parse-id";
import { AuthRequest } from "../middlewares/authMiddleware";

export class CitaController {
  listar = async (req: Request, res: Response, next: NextFunction) => {
    const citas = await citaService.listar();
    return sendSuccess(res, citas);
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const cita = await citaService.obtenerPorId(id);
    return sendSuccess(res, cita);
  };

  crear = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const usuarioId = req.user?.id;

  if (!usuarioId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Usuario no autenticado",
    });
  }

  const cita = await citaService.crear(
    usuarioId,
    req.body
  );

  return sendSuccess(
    res,
    cita,
    "Cita registrada correctamente",
    StatusCodes.CREATED
  );
};

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const cita = await citaService.actualizar(id, req.body);
    return sendSuccess(res, cita, "Cita actualizada correctamente");
  };

  // CAMBIOS DE ESTADO
  aceptar = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const { comentario } = req.body;
    const cita = await citaService.cambiarEstado(
      id,
      "Aceptada",
      "profesional",
      comentario,
    );
    return sendSuccess(res, cita, "Cita aceptada correctamente");
  };

  rechazar = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const { motivo } = req.body;
    const cita = await citaService.cambiarEstado(
      id,
      "Rechazada",
      "profesional",
      motivo,
    );
    return sendSuccess(res, cita, "Cita rechazada correctamente");
  };

  cancelar = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const { motivo, actor } = req.body; // actor: "cliente" o "profesional"
    const cita = await citaService.cambiarEstado(
      id,
      "Cancelada",
      actor,
      motivo,
    );
    return sendSuccess(res, cita, "Cita cancelada correctamente");
  };

  completar = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseId(req.params.id);
    const cita = await citaService.cambiarEstado(
      id,
      "Completada",
      "profesional",
    );
    return sendSuccess(res, cita, "Cita marcada como completada");
  };

  // FILTROS
  filtrarPorEstado = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const idEstado = parseId(req.query.idEstado as string);
    const citas = await citaService.filtrarPorEstado(idEstado);
    return sendSuccess(res, citas);
  };

  filtrarPorProfesional = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const idProfesional = parseId(req.query.idProfesional as string);
    const citas = await citaService.filtrarPorProfesional(idProfesional);
    return sendSuccess(res, citas);
  };

  filtrarPorRangoFechas = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { fechaInicio, fechaFin } = req.query;
    const citas = await citaService.filtrarPorRangoFechas(
      new Date(String(fechaInicio)),
      new Date(String(fechaFin)),
    );
    return sendSuccess(res, citas);
  };
}
