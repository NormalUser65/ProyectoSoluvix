import { prisma } from "../config/prisma";
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  RegisterUserDto,
  LoginUserDto
} from "../dtos/usuario.dto";
import { AppError } from "../utils/app-error";
import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

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
    const rol = await prisma.rol.findUnique({
      where: { id: idRol }
    });

    if (!rol) {
      throw AppError.badRequest("El rol indicado no existe");
    }
  },

  // CREAR USUARIO
  async crear(data: CreateUsuarioDto) {
    await this.validateRol(data.idRol);

    const usuarioExists = await prisma.usuario.findUnique({
      where: {
        correo: data.correo
      }
    });

    if (usuarioExists) {
      throw AppError.badRequest(
        "El correo ya está registrado"
      );
    }

    // Hashear contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(
      data.contrasenna,
      10
    );

    const usuario = await prisma.usuario.create({
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        contrasenna: hashedPassword,
        telefono: data.telefono,
        estado: data.estado ?? true,
        idRol: data.idRol,
      },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });

    // No devolver la contraseña
    const {
      contrasenna,
      ...usuarioSinPassword
    } = usuario;

    return usuarioSinPassword;
  },

  // ACTUALIZAR USUARIO
  async actualizar(id: number, data: UpdateUsuarioDto) {

    if (data.idRol) {
      await this.validateRol(data.idRol);
    }

    // Si se está cambiando la contraseña,
    // se debe volver a hashear
    let hashedPassword: string | undefined;

    if (data.contrasenna) {
      hashedPassword = await bcrypt.hash(
        data.contrasenna,
        10
      );
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        correo: data.correo,
        contrasenna: hashedPassword,
        telefono: data.telefono,
        estado: data.estado,
        idRol: data.idRol,
      },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });

    // No devolver la contraseña
    const {
      contrasenna,
      ...usuarioSinPassword
    } = usuario;

    return usuarioSinPassword;
  },

  // CAMBIAR ESTADO
  async cambiarEstado(id: number, estado: boolean) {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: {
        estado
      },
      include: {
        rol: true,
        perfilProfesional: true,
      },
    });

    // No devolver la contraseña
    const {
      contrasenna,
      ...usuarioSinPassword
    } = usuario;

    return usuarioSinPassword;
  },

  // REGISTRAR USUARIO
  async registrar(data: RegisterUserDto) {

    const usuarioExists = await prisma.usuario.findUnique({
      where: {
        correo: data.correo
      }
    });

    if (usuarioExists) {
      throw new Error(
        "El correo ya está registrado"
      );
    }

    await this.validateRol(data.idRol);

    const hashedPassword = await bcrypt.hash(
      data.contrasenna,
      10
    );

    const usuario = await prisma.usuario.create({
      data: {
        correo: data.correo,
        contrasenna: hashedPassword,
        nombre: data.nombre,
        apellidos: data.apellidos,
        telefono: data.telefono,
        idRol: data.idRol
      },
      include: {
        rol: true
      }
    });

    const {
      contrasenna,
      ...usuarioWithoutPassword
    } = usuario;

    return usuarioWithoutPassword;
  },

  // LOGIN
  async login(data: LoginUserDto) {
  const usuario = await prisma.usuario.findUnique({
    where: {
      correo: data.correo
    },
    include: {
      rol: true
    }
  });

  if (!usuario) {
    throw new Error(
      "Correo o contraseña incorrectos"
    );
  }

  if (!usuario.estado) {
    throw new Error(
      "El usuario se encuentra inactivo"
    );
  }

  let isPasswordValid = false;

  // Si la contraseña está almacenada con bcrypt
  if (
    usuario.contrasenna.startsWith("$2a$") ||
    usuario.contrasenna.startsWith("$2b$") ||
    usuario.contrasenna.startsWith("$2y$")
  ) {
    isPasswordValid = await bcrypt.compare(
      data.contrasenna,
      usuario.contrasenna
    );
  } 
  // Si la contraseña está almacenada como texto plano
  else {
    isPasswordValid =
      data.contrasenna === usuario.contrasenna;
  }

  if (!isPasswordValid) {
    throw new Error(
      "Correo o contraseña incorrectos"
    );
  }

  const payload = {
    id: usuario.id,
    email: usuario.correo,
    role: usuario.rol.nombre
  };

  const secret: Secret =
    process.env.JWT_SECRET || "vj_utn_2026";

  const options: SignOptions = {
    expiresIn: "2h"
  };

  const token = jwt.sign(
    payload,
    secret,
    options
  );

  return {
    token
  };
},

  // PERFIL
  async perfil(usuarioId: number) {

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: usuarioId
      },
      include: {
        rol: true,
        perfilProfesional: true
      }
    });

    if (!usuario) {
      throw new Error(
        "El usuario no existe"
      );
    }

    const {
      contrasenna,
      ...usuarioSinPassword
    } = usuario;

    return usuarioSinPassword;
  },
};