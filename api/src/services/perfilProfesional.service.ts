import { prisma } from "../config/prisma";
import { CreatePerfilProfesionalDto, UpdatePerfilProfesionalDto } from "../dtos/perfilProfesional.dto";
import { AppError } from "../utils/app-error";

export const perfilProfesionalService = {
  async listar() {
    return await prisma.perfilProfesional.findMany({
      include: {
        usuario: { include: { rol: true } }, 
        modalidad: true,
        servicios: true,
        especialidades: {
          include: { especialidad: true }
        },
      },
      orderBy: { tituloProfesional: "asc" }
    });
  },

  async obtenerPorId(id: number) {
    return await prisma.perfilProfesional.findUnique({
      where: { id },
      include: {
        usuario: { include: { rol: true } }, 
        modalidad: true,
        servicios: true,
        especialidades: {
          include: { especialidad: true }
        },
      },
    });
  },

  async validateUsuario(idUsuario: number) {
    const usuario = await prisma.usuario.findUnique({ where: { id: idUsuario } });
    if (!usuario) {
      throw AppError.badRequest("El usuario indicado no existe");
    }
  },

  async validateModalidad(idModalidad?: number) {
    if (!idModalidad) return;
    const modalidad = await prisma.modalidad.findUnique({ where: { id: idModalidad } });
    if (!modalidad) {
      throw AppError.badRequest("La modalidad indicada no existe");
    }
  },

  async crear(data: CreatePerfilProfesionalDto) {
    await this.validateUsuario(data.idUsuario);
    await this.validateModalidad(data.idModalidad);

    return prisma.perfilProfesional.create({
      data: {
        idUsuario: data.idUsuario,
        idModalidad: data.idModalidad,
        tituloProfesional: data.tituloProfesional,
        descripcion: data.descripcion,
        annosExperiencia: data.annosExperiencia,
        provincia: data.provincia,
        canton: data.canton,
        distrito: data.distrito,
        tarifaBase: data.tarifaBase,
        disponible: data.disponible ?? true,
        imagenPerfil: data.imagenPerfil,
      },
      include: {
        usuario: { include: { rol: true } }, 
        modalidad: true,
        servicios: true,
        especialidades: { include: { especialidad: true } },
      },
    });
  },

  async actualizar(id: number, data: UpdatePerfilProfesionalDto) {
    if (data.idUsuario) {
      await this.validateUsuario(data.idUsuario);
    }
    if (data.idModalidad) {
      await this.validateModalidad(data.idModalidad);
    }

    return prisma.perfilProfesional.update({
      where: { id },
      data: {
        idUsuario: data.idUsuario,
        idModalidad: data.idModalidad,
        tituloProfesional: data.tituloProfesional,
        descripcion: data.descripcion,
        annosExperiencia: data.annosExperiencia,
        provincia: data.provincia,
        canton: data.canton,
        distrito: data.distrito,
        tarifaBase: data.tarifaBase,
        disponible: data.disponible,
        imagenPerfil: data.imagenPerfil,
      },
      include: {
        usuario: { include: { rol: true } }, 
        modalidad: true,
        servicios: true,
        especialidades: { include: { especialidad: true } },
      },
    });
  },

  async cambiarDisponibilidad(id: number, disponible: boolean) {
    return prisma.perfilProfesional.update({
      where: { id },
      data: { disponible },
      include: {
        usuario: { include: { rol: true } }, 
        modalidad: true,
        servicios: true,
        especialidades: { include: { especialidad: true } },
      },
    });
  },
};