import { z } from "zod";

// Esquema base sin refinements
const citaBaseSchema = z.object({
  idCliente: z
  .number()
  .int()
  .positive("El cliente es obligatorio"),

  idProfesional: z
  .number()
  .int()
  .positive("El profesional es obligatorio"),

  idServicio: z
  .number()
  .int()
  .positive("El servicio es obligatorio"),

  idModalidad: z
  .number()
  .int()
  .positive("La modalidad es obligatoria"),

  fechaCita: z
  .coerce
  .date({ message: "La fecha de la cita es obligatoria" }),

  horaInicio: z
  .coerce
  .date({ message: "La hora de inicio es obligatoria" }),

  horaFin: z.coerce.date({ message: "La hora de fin es obligatoria" }),

  comentarioCliente: z
    .string()
    .trim()
    .min(10, "El comentario debe tener al menos 10 caracteres")
    .max(500, "El comentario no puede superar los 500 caracteres"),

  comentarioProfesional: z.string().trim().optional(),

  montoEstimado: z.number().positive("El monto estimado debe ser mayor a 0").optional(),
});

// Esquema de creación con refinements
export const createCitaSchema = citaBaseSchema.refine(
  (data) => data.horaFin > data.horaInicio,
  {
    message: "La hora final debe ser posterior a la hora inicial",
    path: ["horaFin"],
  }
);

// Esquema de actualización: se usa el base sin refinements
export const updateCitaSchema = citaBaseSchema.partial();

export type CreateCitaDto = z.infer<typeof createCitaSchema>;
export type UpdateCitaDto = z.infer<typeof updateCitaSchema>;