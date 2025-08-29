export interface LeadInfo {
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  medio_preferido: "WhatsApp" | "Email" | "Llamada";
}

export interface Item {
  material: string;
  piezas: number;
  ancho_m: number;
  alto_m: number;
  m2: number; // readonly calculated
}

export interface Requirement {
  descripcion_breve: string;
  instalacion: boolean;
  ubicacion_instalacion?: string;
  urgente_24h: boolean;
  fecha_objetivo?: string;
  items: Item[];
  link_archivos?: string;
}

export interface Quote {
  m2_total: number;
  base_mxn: number;
  instalacion_mxn: number;
  recargo_urgencia_mxn: number;
  total_estimado_mxn: number;
  desglose_texto: string;
}

export type LeadPayload = {
  lead: {
    nombre: string;
    email: string;
    telefono: string;
    empresa?: string;
    canal_origen: "form";
    medio_preferido: "WhatsApp" | "Email" | "Llamada";
  };
  requerimiento: {
    descripcion_breve: string;
    instalacion: boolean;
    ubicacion_instalacion?: string | null;
    urgente_24h: boolean;
    fecha_objetivo?: string | null; // ISO o null
    items: Array<{
      material: string; // usar label del material
      piezas: number;
      ancho_m: number;
      alto_m: number;
      m2: number;
      notas?: string;
    }>;
  };
  cotizacion_cliente: {
    m2_total: number;
    base_mxn: number;
    instalacion_mxn: number;
    recargo_urgencia_mxn: number;
    total_estimado_mxn: number;
    desglose_texto: string;
  };
};