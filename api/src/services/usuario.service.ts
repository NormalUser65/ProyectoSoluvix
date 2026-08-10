import { prisma } from "../config/prisma";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dtos/usuario.dto";
import { AppError } from "../utils/app-error";

export const usuarioService = {
  async listar() {
    return await prisma.usuario.findMany({
      include: {
        rol: true,
        perfilProfesional: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.usuario.findUnique({
      where: { id },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });
  },

  async validateRol(idRol: number) {
    const rol = await prisma.rol.findUnique({ where: { id: idRol } });
    if (!rol) {
      throw AppError.badRequest("El rol indicado no existe");
    }
  },

  async crear(data: CreateUsuarioDto) {
    await this.validateRol(data.idRol);

    return prisma.usuario.create({
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        contrasenna: data.contrasenna,
        telefono: data.telefono,
        estado: data.estado ?? true, // por defecto activo
        idRol: data.idRol,
      },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });
  },

  async actualizar(id: number, data: UpdateUsuarioDto) {
    if (data.idRol) {
      await this.validateRol(data.idRol);
    }

    return prisma.usuario.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        contrasenna: data.contrasenna,
        telefono: data.telefono,
        estado: data.estado,
        idRol: data.idRol,
      },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });
  },

  async cambiarEstado(id: number, estado: boolean) {
    return prisma.usuario.update({
      where: { id },
      data: { estado },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });
  },
};