import { z } from "zod";

const citaBaseSchema = z.object({
  idProfesional: z.number().int().positive("El profesional es obligatorio"),
  idServicio: z.number().int().positive("El servicio es obligatorio"),
  idModalidad: z.number().int().positive("La modalidad es obligatoria"),

  fechaCita: z.coerce.date({ message: "La fecha de la cita es obligatoria" }),
  horaInicio: z.coerce.date({ message: "La hora de inicio es obligatoria" }),
  horaFin: z.coerce.date({ message: "La hora de fin es obligatoria" }),

  comentarioCliente: z
    .string()
    .trim()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .max(500, "El comentario no puede superar los 500 caracteres"),

  comentarioProfesional: z.string().trim().optional(),

  montoEstimado: z
    .number()
    .positive("El monto estimado debe ser mayor a 0")
    .optional(),
});


export const createCitaSchema = citaBaseSchema.refine(
  (data) => data.horaFin > data.horaInicio,
  {
    message: "La hora final debe ser posterior a la hora inicial",
    path: ["horaFin"],
  }
);

export const updateCitaSchema = citaBaseSchema.partial();


export const aceptarCitaSchema = z.object({
  comentarioProfesional: z.string().trim().max(500).optional(),
});

export const rechazarCitaSchema = z.object({
  motivo: z.string().trim().min(5, "Debe indicar un motivo").max(500),
});

export const cancelarCitaSchema = z.object({
  actor: z.enum(["cliente", "profesional"]),
  motivo: z.string().trim().min(5, "Debe indicar un motivo").max(500),
});

export const completarCitaSchema = z.object({});

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;
export type AceptarCitaDto = z.infer<typeof aceptarCitaSchema>;
export type RechazarCitaDto = z.infer<typeof rechazarCitaSchema>;
export type CancelarCitaDto = z.infer<typeof cancelarCitaSchema>;
export type CompletarCitaDto = z.infer<typeof completarCitaSchema>;