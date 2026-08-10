import { prisma } from "../config/prisma";
import { CreateServicioDto, UpdateServicioDto } from "../dtos/servicio.dto";
import { AppError } from "../utils/app-error"; 

export const servicioService = {
    async listar() {
        return await prisma.servicio.findMany({
            include: {
                perfil: {
                    include: {
                        usuario: true
                    }
                },
                categoria: true,
                modalidad: true,
                especialidades: {
                    include: {
                        especialidad: true
                    }
                }
            },
            orderBy: {
                nombre: "asc"
            }
        });
    },

    async obtenerPorId(id: number) {
        return await prisma.servicio.findUnique({
            where: { id },
            include: {
                perfil: {
                    include: {
                        usuario: true
                    }
                },
                categoria: true,
                modalidad: true,
                especialidades: {
                    include: {
                        especialidad: true
                    }
                }
            }
        });
    },

    async validatePerfil(idPerfil: number) {
    const perfil = await prisma.perfilProfesional.findUnique({ where: { id: idPerfil } });
    if (!perfil) {
      throw AppError.badRequest("El perfil profesional indicado no existe");
    }
  },

  async validateCategoria(idCategoria: number) {
    const categoria = await prisma.categoria.findUnique({ where: { id: idCategoria } });
    if (!categoria) {
      throw AppError.badRequest("La categoría indicada no existe");
    }
  },

  async validateModalidad(idModalidad: number) {
    const modalidad = await prisma.modalidad.findUnique({ where: { id: idModalidad } });
    if (!modalidad) {
      throw AppError.badRequest("La modalidad indicada no existe");
    }
  },

  async crear(data: CreateServicioDto) {
  await this.validatePerfil(data.idPerfil);
  await this.validateCategoria(data.idCategoria);
  await this.validateModalidad(data.idModalidad);

  return prisma.servicio.create({
    data: {
      idPerfil: data.idPerfil,
      idCategoria: data.idCategoria,
      idModalidad: data.idModalidad,
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      duracionEstimada: data.duracionEstimada,
      estado: data.estado ?? true,
      especialidades: data.especialidadIds
        ? {
            create: data.especialidadIds.map((id) => ({
              idEspecialidad: id,
            })),
          }
        : undefined,
    },
    include: {
      perfil: { include: { usuario: true } },
      categoria: true,
      modalidad: true,
      especialidades: { include: { especialidad: true } },
    },
  });
},

async actualizar(id: number, data: UpdateServicioDto) {
  return prisma.servicio.update({
    where: { id },
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio: data.precio,
      duracionEstimada: data.duracionEstimada,
      estado: data.estado,
      idCategoria: data.idCategoria,
      idModalidad: data.idModalidad,
      especialidades: data.especialidadIds
        ? {
            deleteMany: {},
            create: data.especialidadIds.map((id) => ({
              idEspecialidad: id,
            })),
          }
        : undefined,
    },
    include: {
      perfil: { include: { usuario: true } },
      categoria: true,
      modalidad: true,
      especialidades: { include: { especialidad: true } },
    },
  });
}

};