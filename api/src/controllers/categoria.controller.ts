import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { categoriaService } from "../services/Categoria.Service.js";
import { sendSuccess } from "../utils/http-response.js";
import { parseId } from "../utils/parse-id.js";

export class CategoriaController {
  listar = async (request: Request, response: Response, next: NextFunction) => {
    const categorias = await categoriaService.listar();
    return sendSuccess(response, categorias);
  };

  obtenerPorId = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const categoria = await categoriaService.obtenerPorId(id);
    return sendSuccess(response, categoria);
  };

  crear = async (request: Request, response: Response, next: NextFunction) => {
    const categoria = await categoriaService.crear(request.body);
    return sendSuccess(response, categoria, "Categoría creada correctamente", StatusCodes.CREATED);
  };

  actualizar = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const categoria = await categoriaService.actualizar(id, request.body);
    return sendSuccess(response, categoria, "Categoría actualizada correctamente");
  };

  cambiarEstado = async (request: Request, response: Response, next: NextFunction) => {
    const id = parseId(request.params.id);
    const { estado } = request.body;
    const categoria = await categoriaService.cambiarEstado(id, estado);
    return sendSuccess(response, categoria, "Estado de categoría actualizado correctamente");
  };

  buscarPorNombre = async (request: Request, response: Response, next: NextFunction) => {
    const { nombre } = request.query;
    const categorias = await categoriaService.buscarPorNombre(String(nombre));
    return sendSuccess(response, categorias);
  };

  filtrarPorEstado = async (request: Request, response: Response, next: NextFunction) => {
    const { estado } = request.query;
    const categorias = await categoriaService.filtrarPorEstado(estado === "true");
    return sendSuccess(response, categorias);
  };
}
