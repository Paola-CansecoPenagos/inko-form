import { z } from "zod";

export const leadInfoSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  telefono: z.string().regex(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),
  empresa: z.string().optional(),
  medio_preferido: z.enum(["WhatsApp", "Email", "Llamada"], {
    required_error: "Selecciona un medio de contacto preferido"
  }),
});

export const itemSchema = z.object({
  material: z.string().min(1, "Selecciona un material"),
  piezas: z.number().int().min(1, "Mínimo 1 pieza"),
  ancho_m: z.number().min(0.1, "Mínimo 0.1 metros"),
  alto_m: z.number().min(0.1, "Mínimo 0.1 metros"),
  m2: z.number(),
});

const baseRequirementSchema = z.object({
  descripcion_breve: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  instalacion: z.boolean(),
  ubicacion_instalacion: z.string().optional(),
  urgente_24h: z.boolean(),
  fecha_objetivo: z.string().optional(),
  items: z.array(itemSchema).min(1, "Agrega al menos un ítem"),
  link_archivos: z.string().optional(),
});

export const requirementSchema = baseRequirementSchema.refine((data) => {
  if (data.instalacion && (!data.ubicacion_instalacion || data.ubicacion_instalacion.length < 4)) {
    return false;
  }
  return true;
}, {
  message: "La ubicación de instalación es requerida y debe tener al menos 4 caracteres",
  path: ["ubicacion_instalacion"]
});

export const formSchema = z.object({
  ...leadInfoSchema.shape,
  ...baseRequirementSchema.shape,
  consentimiento: z.boolean().refine(val => val === true, {
    message: "Debes autorizar el tratamiento de datos"
  }),
}).refine((data) => {
  if (data.instalacion && (!data.ubicacion_instalacion || data.ubicacion_instalacion.length < 4)) {
    return false;
  }
  return true;
}, {
  message: "La ubicación de instalación es requerida y debe tener al menos 4 caracteres",
  path: ["ubicacion_instalacion"]
});

export type FormData = z.infer<typeof formSchema>;