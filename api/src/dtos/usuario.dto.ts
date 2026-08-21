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
        .max(20)
        .optional(),

    idRol: z
        .number()
        .int()
        .positive(),
});

export const loginUserSchema = z.object({
    correo: z
        .string()
        .email(),

    contrasenna: z
        .string()
        .min(6),
});
export const updateUsuarioSchema =
createUsuarioSchema.partial();

export type CreateUsuarioDto =
z.infer<typeof createUsuarioSchema>;

export type UpdateUsuarioDto =
z.infer<typeof updateUsuarioSchema>;

export type RegisterUserDto =
z.infer<typeof registerUserSchema>;

export type LoginUserDto =
z.infer<typeof loginUserSchema>;