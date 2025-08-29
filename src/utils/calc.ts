import { MATERIALS, INSTALLATION_FEE, URGENCY_RATE, MIN_ORDER } from './pricing';

export function calcItemM2(piezas: number, ancho: number, alto: number): number {
  return piezas * ancho * alto;
}

export function calcBaseMXN(items: Array<{ materialKey: string; m2: number }>): number {
  return items.reduce((total, item) => {
    const material = MATERIALS.find(m => m.key === item.materialKey);
    if (!material) return total;
    return total + (item.m2 * material.price);
  }, 0);
}

export function computeQuote(params: {
  items: Array<{ materialKey: string; piezas: number; ancho_m: number; alto_m: number }>;
  instalacion: boolean;
  urgente_24h: boolean;
}): {
  m2_total: number;
  base_mxn: number;
  instalacion_mxn: number;
  recargo_urgencia_mxn: number;
  total_estimado_mxn: number;
  desglose_texto: string;
} {
  // Calcular m² por ítem
  const itemsWithM2 = params.items.map(item => ({
    ...item,
    m2: calcItemM2(item.piezas, item.ancho_m, item.alto_m)
  }));

  const m2_total = itemsWithM2.reduce((total, item) => total + item.m2, 0);
  
  // Calcular base
  const base_mxn = calcBaseMXN(itemsWithM2.map(item => ({
    materialKey: item.materialKey,
    m2: item.m2
  })));

  // Calcular instalación
  const instalacion_mxn = params.instalacion ? INSTALLATION_FEE : 0;

  // Calcular urgencia
  const baseConInstalacion = base_mxn + instalacion_mxn;
  const recargo_urgencia_mxn = params.urgente_24h ? Math.round(baseConInstalacion * URGENCY_RATE) : 0;

  // Total antes del mínimo
  const subtotal = baseConInstalacion + recargo_urgencia_mxn;
  const total_estimado_mxn = Math.max(subtotal, MIN_ORDER);

  // Generar desglose
  const desglose_partes = [];
  
  // Descripción de ítems
  itemsWithM2.forEach(item => {
    const material = MATERIALS.find(m => m.key === item.materialKey);
    if (material) {
      desglose_partes.push(
        `${item.piezas} ${material.label} de ${item.ancho_m}×${item.alto_m}m (${item.m2.toFixed(2)} m²)`
      );
    }
  });

  desglose_partes.push(`\nBase: $${base_mxn.toLocaleString()}`);
  
  if (instalacion_mxn > 0) {
    desglose_partes.push(`Instalación: $${instalacion_mxn.toLocaleString()}`);
  }
  
  if (recargo_urgencia_mxn > 0) {
    desglose_partes.push(`Urgencia 24h (+30%): $${recargo_urgencia_mxn.toLocaleString()}`);
  }

  if (total_estimado_mxn > subtotal) {
    desglose_partes.push(`\nMínimo de orden aplicado: $${MIN_ORDER.toLocaleString()}`);
  }

  const desglose_texto = desglose_partes.join('\n');

  return {
    m2_total,
    base_mxn,
    instalacion_mxn,
    recargo_urgencia_mxn,
    total_estimado_mxn,
    desglose_texto,
  };
}