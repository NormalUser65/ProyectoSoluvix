import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { usuarioService } from "../services/usuario.service";
import { sendSuccess } from "../utils/http-response"; 
import { parseId } from "../utils/parse-id";

export class UsuarioController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const usuarios = await usuarioService.listar();
    return sendSuccess(response, usuarios);
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const usuario = await usuarioService.obtenerPorId(id);
    return sendSuccess(response, usuario);
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    const usuario = await usuarioService.crear(request.body);
    return sendSuccess(response, usuario, "Usuario creado correctamente", StatusCodes.CREATED);
  };

  actualizar = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const usuario = await usuarioService.actualizar(id, request.body);
    return sendSuccess(response, usuario, "Usuario actualizado correctamente");
  };

  cambiarEstado = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const { estado } = request.body;
    const usuario = await usuarioService.cambiarEstado(id, estado);
    return sendSuccess(response, usuario, "Estado de usuario actualizado correctamente");
  };
}