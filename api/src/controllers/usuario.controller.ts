import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { usuarioService } from "../services/usuario.service";
import { sendSuccess } from "../utils/http-response"; 
import { parseId } from "../utils/parse-id";
import { AuthRequest } from "../middlewares/authMiddleware";

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

    registrar = async (
    request: Request,
    response: Response,
    next: NextFunction
    ) => {
    try {
        const usuario = await usuarioService.registrar(request.body);

        return sendSuccess(
        response,
        usuario,
        "Usuario registrado correctamente",
        StatusCodes.CREATED
        );

    } catch (error) {
        const message =
        error instanceof Error
            ? error.message
            : "No fue posible registrar el usuario";

        if (message === "El correo ya está registrado") {
        return response
            .status(StatusCodes.BAD_REQUEST)
            .json({
            success: false,
            message: "Ya existe una cuenta registrada con este correo.",
            });
        }

        next(error);
    }
    };

    login = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    try {

        const result =
            await usuarioService.login(
                request.body
            );

        return sendSuccess(
            response,
            result,
            "Inicio de sesión correcto"
        );

    } catch (error) {

        const message =
            error instanceof Error
                ? error.message
                : "Credenciales incorrectas";

        if (
            message ===
                "Correo o contraseña incorrectos" ||
            message ===
                "El usuario se encuentra inactivo"
        ) {

            return response
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: false,
                    message:
                        "Credenciales incorrectas",
                });

        }

        next(error);
    }
};

    perfil = async (
    request: AuthRequest,
    response: Response,
    next: NextFunction
) => {

    const usuarioId =
        request.user?.id;

    if (!usuarioId) {

        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                success: false,
                message:
                    "Usuario no autenticado: " +
                    usuarioId,
            });

    }


    const usuario =
        await usuarioService.perfil(
            usuarioId
        );


    if (!usuario) {

        return response
            .status(StatusCodes.NOT_FOUND)
            .json({
                success: false,
                message:
                    "El usuario autenticado no existe: " +
                    usuarioId
            });

    }


    return sendSuccess(
        response,
        usuario,
        "Perfil obtenido correctamente"
    );
};

actualizarPerfil = async (
    request: AuthRequest,
    response: Response,
    next: NextFunction
    ) => {
    try {
        const usuarioId = request.user?.id;

        if (!usuarioId) {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({
            success: false,
            message: "Usuario no autenticado",
            });
        }

        const usuario = await usuarioService.actualizarPerfil(
        usuarioId,
        request.body
        );

        return sendSuccess(
        response,
        usuario,
        "Perfil actualizado correctamente"
        );

    } catch (error) {
        const message =
        error instanceof Error
            ? error.message
            : "No fue posible actualizar el perfil";

        if (message === "El correo ya está registrado") {
        return response
            .status(StatusCodes.BAD_REQUEST)
            .json({
            success: false,
            message: "Ya existe una cuenta registrada con este correo.",
            });
        }

        if (message === "Usuario no encontrado") {
        return response
            .status(StatusCodes.NOT_FOUND)
            .json({
            success: false,
            message: "El usuario no existe",
            });
        }

        next(error);
    }
};
}