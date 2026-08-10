import { z } from "zod";

export const createProfesionalEspecialidadSchema = z.object({
  idPerfil: z
    .number()
    .int()
    .positive("El perfil profesional es obligatorio"),

  idEspecialidad: z
    .number()
    .int()
    .positive("La especialidad es obligatoria"),
});

export const updateProfesionalEspecialidadSchema = createProfesionalEspecialidadSchema.partial();

export type CreateProfesionalEspecialidadDto = z.infer<typeof createProfesionalEspecialidadSchema>;
export type UpdateProfesionalEspecialidadDto = z.infer<typeof updateProfesionalEspecialidadSchema>;
