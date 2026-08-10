import { z } from "zod";

export const createEstadoCitaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre del estado debe tener al menos 3 caracteres")
    .max(50, "El nombre del estado no puede superar los 50 caracteres"),
});

export const updateEstadoCitaSchema = createEstadoCitaSchema.partial();

export type CreateEstadoCitaDto = z.infer<typeof createEstadoCitaSchema>;
export type UpdateEstadoCitaDto = z.infer<typeof updateEstadoCitaSchema>;