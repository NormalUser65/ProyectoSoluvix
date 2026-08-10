import { z } from "zod";

export const createPerfilProfesionalSchema = z.object({
  idUsuario: z
    .number()
    .int()
    .positive("El usuario es obligatorio"),

  idModalidad: z
    .number()
    .int()
    .positive("La modalidad es obligatoria")
    .optional(),

  tituloProfesional: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(150, "El título no puede superar los 150 caracteres"),

  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),

  annosExperiencia: z
    .number()
    .int()
    .min(0, "Los años de experiencia no pueden ser negativos")
    .max(50, "Los años de experiencia no pueden superar 50")
    .optional(),

  provincia: z.string().trim().optional(),
  canton: z.string().trim().optional(),
  distrito: z.string().trim().optional(),

  tarifaBase: z
    .number()
    .positive("La tarifa debe ser mayor a 0")
    .optional(),

  disponible: z.boolean().default(true),

  imagenPerfil: z
    .string()
    .trim()
    .max(255, "La ruta de la imagen no puede superar 255 caracteres")
    .optional(),
});

export const updatePerfilProfesionalSchema = createPerfilProfesionalSchema.partial();

export type CreatePerfilProfesionalDto = z.infer<typeof createPerfilProfesionalSchema>;
export type UpdatePerfilProfesionalDto = z.infer<typeof updatePerfilProfesionalSchema>;