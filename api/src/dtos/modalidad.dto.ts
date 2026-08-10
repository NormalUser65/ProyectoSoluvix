import { z } from "zod";

export const createModalidadSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre de la modalidad debe tener al menos 3 caracteres")
    .max(50, "El nombre de la modalidad no puede superar los 50 caracteres"),
});

export const updateModalidadSchema = createModalidadSchema.partial();

export type CreateModalidadDto = z.infer<typeof createModalidadSchema>;
export type UpdateModalidadDto = z.infer<typeof updateModalidadSchema>;