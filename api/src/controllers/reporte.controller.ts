import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { reporteService } from "../services/reporte.service";
import { AppError } from "../utils/app-error";

export class ReporteController {
    
    obtenerCitasPorEstado = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { fechaInicio, fechaFin, idProfesional, idCategoria } = req.query;

      // Validar rango de fechas
      if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio as string);
        const fin = new Date(fechaFin as string);
        if (inicio > fin) {
          throw AppError.badRequest(
            "La fecha de inicio no puede ser mayor que la fecha de fin",
          );
        }
      }

      const result = await reporteService.obtenerCitasPorEstado({
        fechaInicio: fechaInicio as string,
        fechaFin: fechaFin as string,
        idProfesional: idProfesional ? Number(idProfesional) : undefined,
        idCategoria: idCategoria ? Number(idCategoria) : undefined,
      });

      return res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  obtenerCitasPorProfesional = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { fechaInicio, fechaFin, idProfesional } = req.query;
      const usuarioId = (req as any).user?.id;
      const usuarioRol = (req as any).user?.role;

      console.log('Usuario autenticado:', { usuarioId, usuarioRol });

      if (!usuarioId || !usuarioRol) {
        throw AppError.unauthorized("Usuario no autenticado");
      }

      if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio as string);
        const fin = new Date(fechaFin as string);
        if (inicio > fin) {
          throw AppError.badRequest(
            "La fecha de inicio no puede ser mayor que la fecha de fin",
          );
        }
      }

      const result = await reporteService.obtenerCitasPorProfesional(
        {
          fechaInicio: fechaInicio as string,
          fechaFin: fechaFin as string,
          idProfesional: idProfesional ? Number(idProfesional) : undefined,
        },
        usuarioId,
        usuarioRol,
      );

      return res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  obtenerCalificaciones = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { idProfesional, umbralBajaCalificacion } = req.query;
      const usuarioId = (req as any).user?.id;
      const usuarioRol = (req as any).user?.role;

      console.log('Usuario autenticado:', { usuarioId, usuarioRol });

      if (!usuarioId || !usuarioRol) {
        throw AppError.unauthorized("Usuario no autenticado");
      }

      const result = await reporteService.obtenerCalificaciones(
        {
          idProfesional: idProfesional ? Number(idProfesional) : undefined,
          umbralBajaCalificacion: umbralBajaCalificacion
            ? Number(umbralBajaCalificacion)
            : 2.5,
        },
        usuarioId,
        usuarioRol,
      );

      return res.status(StatusCodes.OK).json({ success: true, data: result });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}