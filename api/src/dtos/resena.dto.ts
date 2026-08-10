import { z } from "zod";

export const createResenaSchema = z.object({
  idCita: z
    .number()
    .int()
    .positive("La cita es obligatoria"),

  idCliente: z
    .number()
    .int()
    .positive("El cliente es obligatorio"),

  idProfesional: z
    .number()
    .int()
    .positive("El profesional es obligatorio"),

  puntuacion: z
    .number()
    .int()
    .min(1, "La puntuación mínima es 1")
    .max(5, "La puntuación máxima es 5"),

  comentario: z
    .string()
    .trim()
    .max(500, "El comentario no puede superar los 500 caracteres")
    .optional(),
});

export const updateResenaSchema = createResenaSchema.partial();

export type CreateResenaDto = z.infer<typeof createResenaSchema>;
export type UpdateResenaDto = z.infer<typeof updateResenaSchema>;