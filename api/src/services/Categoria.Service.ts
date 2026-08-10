import { prisma } from "../config/prisma";
import { CreateCategoriaDto, UpdateCategoriaDto } from "../dtos/categoria.dto";
import { AppError } from "../utils/app-error";

export const categoriaService = {
  async listar() {
    return await prisma.categoria.findMany({
      orderBy: { nombre: "asc" },
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.categoria.findUnique({
      where: { id },
    });
  },

  async validateNombre(nombre: string) {
  const categoria = await prisma.categoria.findFirst({
    where: { nombre }
  });
  if (categoria) {
    throw AppError.badRequest("Ya existe una categoría con ese nombre");
  }
}
,

  async crear(data: CreateCategoriaDto) {
    await this.validateNombre(data.nombre);

    return prisma.categoria.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: data.estado ?? true, // por defecto activa
      },
    });
  },

  async actualizar(id: number, data: UpdateCategoriaDto) {
    if (data.nombre) {
      await this.validateNombre(data.nombre);
    }

    return prisma.categoria.update({
      where: { id },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        estado: data.estado,
      },
    });
  },

  async cambiarEstado(id: number, estado: boolean) {
    return prisma.categoria.update({
      where: { id },
      data: { estado },
    });
  },

  async buscarPorNombre(nombre: string) {
    return prisma.categoria.findMany({
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
    return prisma.categoria.findMany({
      where: { estado },
      orderBy: { nombre: "asc" },
    });
  },
};