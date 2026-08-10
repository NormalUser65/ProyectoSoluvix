import { z } from "zod";

export const createRolSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre del rol debe tener al menos 3 caracteres")
    .max(50, "El nombre del rol no puede superar los 50 caracteres"),
});

export const updateRolSchema = createRolSchema.partial();

export type CreateRolDto = z.infer<typeof createRolSchema>;
export type UpdateRolDto = z.infer<typeof updateRolSchema>;