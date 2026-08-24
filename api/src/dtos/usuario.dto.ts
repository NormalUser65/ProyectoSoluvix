import { z } from "zod";

export const createUsuarioSchema = z.object({
    nombre: z
        .string()
        .trim()
        .min(2, "El nombre debe tener como mínimo dos letras")
        .max(100, "El nombre no puede superar los 100 caracteres"),

    apellidos: z
        .string()
        .trim()
        .min(2)
        .max(100),

    correo: z
        .string()
        .email(),

    contrasenna: z
        .string()
        .min(6),

    telefono: z
        .string()
        .max(20)
        .optional(),

    idRol: z
        .number()
        .int()
        .positive(),

    estado: z
        .boolean()
        .optional() 
});

export const registerUserSchema = z.object({
  correo: z
    .string()
    .email()
    .max(150),

  contrasenna: z
    .string()
    .min(6)
    .max(255),

  nombre: z
    .string()
    .trim()
    .min(2)
    .max(100),

  apellidos: z
    .string()
    .trim()
    .min(2)
    .max(100),

  telefono: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .max(20),
});

export const loginUserSchema = z.object({
    correo: z
    .string()
    .email(),

    contrasenna: z
    .string()
    .min(6),
});

export const updatePerfilSchema = z.object({
    nombre: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre no puede superar 100 caracteres" }),

    apellidos: z
    .string()
    .trim()
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" })
    .max(100, { message: "Los apellidos no pueden superar 100 caracteres" }),

    correo: z
    .string()
    .email({ message: "Debe ingresar un correo válido" })
    .max(150, { message: "El correo no puede superar 150 caracteres" }),

    telefono: z
    .string()
    .trim()
    .min(1, { message: "El teléfono es obligatorio" })
    .max(20, { message: "El teléfono no puede superar 20 caracteres" }),

    contrasenna: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(255, { message: "La contraseña no puede superar 255 caracteres" })
    .optional(),
});

export type RegisterUserDto =
z.infer<typeof registerUserSchema>;

export type LoginUserDto =
z.infer<typeof loginUserSchema>;

export const updateUsuarioSchema =
createUsuarioSchema.partial();

export type CreateUsuarioDto =
z.infer<typeof createUsuarioSchema>;

export type UpdateUsuarioDto =
z.infer<typeof updateUsuarioSchema>;

export type UpdatePerfilDto =
z.infer<typeof updatePerfilSchema>;
