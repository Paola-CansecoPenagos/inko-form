# INKO Impresores - Sistema de Cotización

Una aplicación web React + Vite + TypeScript con Material UI para capturar leads y calcular cotizaciones en tiempo real para INKO Impresores.

## Características

- ✅ Formulario reactivo con validaciones en tiempo real
- ✅ Cálculo automático de cotizaciones con materiales personalizables
- ✅ Interfaz responsive y accesible
- ✅ Integración con webhook para envío de leads
- ✅ Gestión de estados con react-hook-form + Zod
- ✅ Tema profesional con Material UI v5

## Tecnologías

- **Frontend**: React 18 + Vite + TypeScript
- **UI**: Material UI v5 + Emotion
- **Validaciones**: Zod + react-hook-form
- **Fechas**: dayjs
- **Estilos**: Material UI (sin Tailwind)

## Estructura del proyecto

```
src/
  ├── main.tsx              # Punto de entrada
  ├── App.tsx               # Componente raíz
  ├── theme.ts              # Configuración de tema MUI
  ├── types.ts              # Definiciones TypeScript
  ├── utils/
  │   ├── pricing.ts        # Constantes de negocio y precios
  │   ├── calc.ts           # Lógica de cálculos
  │   └── validators.ts     # Esquemas de validación Zod
  ├── api/
  │   └── sendLead.ts       # Envío de leads al webhook
  ├── components/
  │   ├── BrandHeader.tsx   # Header con logo y contacto
  │   ├── LeadForm.tsx      # Formulario principal
  │   ├── ItemsTable.tsx    # Tabla editable de ítems
  │   ├── SummaryPanel.tsx  # Panel de resumen de cotización
  │   └── ConsentText.tsx   # Checkbox de consentimiento
  └── assets/
      └── logo.png          # Logo de INKO
```

## Configuración

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con la URL del webhook:
   ```
   VITE_N8N_WEBHOOK_URL=https://paolaacp.app.n8n.cloud/webhook-test/inko/form
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

4. **Build para producción**:
   ```bash
   npm run build
   ```

## Catálogo de materiales

| Material | Precio por m² |
|----------|---------------|
| Lona Frontlit 13 oz | $120 MXN |
| Vinil Adhesivo Brillante | $180 MXN |
| Vinil Microperforado | $220 MXN |
| PVC 3mm (rígido) | $250 MXN |
| Acrílico 6mm | $400 MXN |

## Reglas de negocio

- **Base**: Suma de (m² × precio_material) para todos los ítems
- **Instalación**: +$500 MXN (opcional)
- **Urgencia 24h**: +30% sobre (Base + Instalación)
- **Mínimo de orden**: $800 MXN
- **Total**: `max(Base + Instalación + Urgencia, $800)`

## Casos de prueba

### 1. Ejemplo del enunciado
**Configuración**: 3 lonas de 2×1.5 m, urgente, con instalación
- 3 ítems × Lona Frontlit × 2m × 1.5m = 9 m²
- Base: 9 × $120 = $1,080
- Instalación: $500
- Urgencia (+30%): $474
- **Total: $2,054 MXN**

### 2. Microperforado 5 m² sin urgencia
**Configuración**: 1 ítem de 2.5×2 m de vinil microperforado
- 1 × 2.5 × 2 = 5 m²
- Base: 5 × $220 = $1,100
- Sin instalación ni urgencia
- **Total: $1,100 MXN**

### 3. PVC 3mm 2 m² urgente
**Configuración**: 1 ítem de 1.4×1.4 m de PVC, urgente
- 1 × 1.4 × 1.4 ≈ 2 m²
- Base: 2 × $250 = $500
- Urgencia (+30%): $150
- Subtotal: $650 → aplicar mínimo
- **Total: $800 MXN** (por mínimo de orden)

### 4. Acrílico 6mm 1.2 m² con instalación
**Configuración**: 1 ítem de 1×1.2 m de acrílico, con instalación
- 1 × 1 × 1.2 = 1.2 m²
- Base: 1.2 × $400 = $480
- Instalación: $500
- **Total: $980 MXN**

## Payload de envío

El formulario genera un payload JSON con esta estructura:

```typescript
{
  lead: {
    nombre: string;
    email: string;
    telefono: string; // 10 dígitos
    empresa?: string;
    canal_origen: "form";
    medio_preferido: "WhatsApp" | "Email" | "Llamada";
  },
  requerimiento: {
    descripcion_breve: string;
    instalacion: boolean;
    ubicacion_instalacion?: string | null;
    urgente_24h: boolean;
    fecha_objetivo?: string | null; // ISO date
    items: Array<{
      material: string; // label del material
      piezas: number;
      ancho_m: number;
      alto_m: number;
      m2: number;
    }>;
  },
  cotizacion_cliente: {
    m2_total: number;
    base_mxn: number;
    instalacion_mxn: number;
    recargo_urgencia_mxn: number;
    total_estimado_mxn: number;
    desglose_texto: string;
  }
}
```

## Contacto

- **Teléfono**: 55-6675-6094
- **Email**: flavio@inkoimpresores.com
- **Empresa**: INKO Impresores

## Deploy en Replit

1. Importar el repositorio en Replit
2. Configurar la variable de entorno `VITE_N8N_WEBHOOK_URL`
3. Ejecutar `npm install && npm run dev`
4. La aplicación estará disponible en el puerto 8080

## Notas técnicas

- Todas las validaciones son client-side con Zod
- El formulario es completamente reactivo (cálculos en tiempo real)
- Se utiliza react-hook-form para gestión de estado del formulario
- Material UI proporciona componentes accesibles por defecto
- El tema está optimizado para uso profesional
- Sin dependencias de backend (excepto el webhook para envío)