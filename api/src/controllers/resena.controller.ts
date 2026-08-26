import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { resenaService } from "../services/resena.service";

export class ResenaController {
  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resenas = await resenaService.listar();
      return res.status(StatusCodes.OK).json({ success: true, data: resenas });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const resena = await resenaService.obtenerPorId(id);
      return res.status(StatusCodes.OK).json({ success: true, data: resena });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  obtenerPorProfesional = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idProfesional = Number(req.params.idProfesional);
      const resenas = await resenaService.obtenerPorProfesional(idProfesional);
      return res.status(StatusCodes.OK).json({ success: true, data: resenas });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  obtenerPorCita = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idCita = Number(req.params.idCita);
      const resena = await resenaService.obtenerPorCita(idCita);
      return res.status(StatusCodes.OK).json({ success: true, data: resena });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idCita, idCliente, puntuacion, comentario } = req.body;

      const nuevaResena = await resenaService.crear(
        Number(idCita),
        Number(idCliente),
        Number(puntuacion),
        comentario,
      );

      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Reseña registrada correctamente",
        data: nuevaResena,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}