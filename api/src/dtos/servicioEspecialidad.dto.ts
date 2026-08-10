import { z } from "zod";

export const createServicioEspecialidadSchema = z.object({
  idServicio: z
    .number()
    .int()
    .positive("El servicio es obligatorio"),

  idEspecialidad: z
    .number()
    .int()
    .positive("La especialidad es obligatoria"),
});

export const updateServicioEspecialidadSchema = createServicioEspecialidadSchema.partial();

export type CreateServicioEspecialidadDto = z.infer<typeof createServicioEspecialidadSchema>;
export type UpdateServicioEspecialidadDto = z.infer<typeof updateServicioEspecialidadSchema>;