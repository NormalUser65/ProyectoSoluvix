import { z } from "zod";

export const createEspecialidadSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre de la especialidad debe tener al menos 3 caracteres")
    .max(100, "El nombre de la especialidad no puede superar los 100 caracteres"),

  descripcion: z
    .string()
    .trim()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional(),

  estado: z.boolean().default(true),
});

export const updateEspecialidadSchema = createEspecialidadSchema.partial();

export type CreateEspecialidadDto = z.infer<typeof createEspecialidadSchema>;
export type UpdateEspecialidadDto = z.infer<typeof updateEspecialidadSchema>;