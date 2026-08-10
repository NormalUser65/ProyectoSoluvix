import { prisma } from "../config/prisma";
import { CreateEspecialidadDto, UpdateEspecialidadDto } from "../dtos/especialidad.dto";
import { AppError } from "../utils/app-error";

export const especialidadService = {
  async listar() {
    return await prisma.especialidad.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.especialidad.findUnique({
      where: { id },
    });
  },

  async validateNombre(nombre: string) {
    const especialidad = await prisma.especialidad.findFirst({ where: { nombre } });
    if (especialidad) {
      throw AppError.badRequest("Ya existe una especialidad con ese nombre");
    }
  },

  async crear(data: CreateEspecialidadDto) {
    await this.validateNombre(data.nombre);

    return prisma.especialidad.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: data.estado ?? true,
      },
    });
  },

  async actualizar(id: number, data: UpdateEspecialidadDto) {
    if (data.nombre) {
      const existe = await prisma.especialidad.findFirst({ where: { nombre: data.nombre } });
      if (existe && existe.id !== id) {
        throw AppError.badRequest("Ya existe otra especialidad con ese nombre");
      }
    }

    return prisma.especialidad.update({
      where: { id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: data.estado,
      },
    });
  },

  async cambiarEstado(id: number, estado: boolean) {
    return prisma.especialidad.update({
      where: { id },
      data: { estado },
    });
  },

  async buscarPorNombre(nombre: string) {
    return prisma.especialidad.findMany({
      where: {
        nombre: {
          contains: nombre,
          mode: "insensitive",
        },
      },
      orderBy: { nombre: "asc" },
    });
  },

  async filtrarPorEstado(estado: boolean) {
    return prisma.especialidad.findMany({
      where: { estado },
      orderBy: { nombre: "asc" },
    });
  },
};