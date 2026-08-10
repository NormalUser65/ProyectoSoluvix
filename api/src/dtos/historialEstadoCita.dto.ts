import { z } from "zod";

export const createHistorialEstadoSchema = z.object({
  idCita: z
    .number()
    .int()
    .positive("La cita es obligatoria"),

  idEstadoAnterior: z
    .number()
    .int()
    .positive("El estado anterior debe ser válido")
    .optional(),

  idEstadoNuevo: z
    .number()
    .int()
    .positive("El estado nuevo es obligatorio"),

  comentario: z
    .string()
    .trim()
    .max(500, "El comentario no puede superar los 500 caracteres")
    .optional(),
});

export const updateHistorialEstadoSchema = createHistorialEstadoSchema.partial();

export type CreateHistorialEstadoDto = z.infer<typeof createHistorialEstadoSchema>;
export type UpdateHistorialEstadoDto = z.infer<typeof updateHistorialEstadoSchema>;