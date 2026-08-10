import { z } from "zod";

export const createServicioSchema = z.object({
  idPerfil: z
    .number()
    .int()
    .positive("El perfil profesional es obligatorio"),

  idCategoria: z
    .number()
    .int()
    .positive("La categoría es obligatoria"),

  idModalidad: z
    .number()
    .int()
    .positive("La modalidad es obligatoria"),

  nombre: z
    .string()
    .trim()
    .min(3, "El nombre del servicio debe tener al menos 3 caracteres")
    .max(150, "El nombre del servicio no puede superar los 150 caracteres"),

  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),

  precio: z
    .number({ message: "El precio debe ser numérico" })
    .positive("El precio debe ser mayor a 0"),

  duracionEstimada: z
    .number()
    .int()
    .positive("La duración estimada debe ser mayor a 0"),

  estado: z.boolean().default(true),

  especialidadIds: z
    .array(z.number().int().positive("La especialidad debe ser válida"))
    .optional(),
});

export const updateServicioSchema = createServicioSchema.partial();

export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;