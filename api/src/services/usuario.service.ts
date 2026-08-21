import { prisma } from "../config/prisma";
import { CreateUsuarioDto, UpdateUsuarioDto, RegisterUserDto, LoginUserDto} from "../dtos/usuario.dto";
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

  async registrar(data: RegisterUserDto) {
  const usuarioExists = await prisma.usuario.findUnique({
    where: { correo: data.correo }
  });

  if (usuarioExists) {
    throw new Error("El correo ya está registrado");
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

async login(data: LoginUserDto) {
  const usuario = await prisma.usuario.findUnique({
    where: { correo: data.correo },
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

  const isPasswordValid = await bcrypt.compare(
    data.contrasenna,
    usuario.contrasenna
  );

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

  const options: SignOptions = {expiresIn: "2h"};

  const token = jwt.sign(payload, secret, options);

  return {
    token
  };
},

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