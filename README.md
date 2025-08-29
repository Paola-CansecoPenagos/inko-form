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

## Notas técnicas

- Todas las validaciones son client-side con Zod
- El formulario es completamente reactivo (cálculos en tiempo real)
- Se utiliza react-hook-form para gestión de estado del formulario
- Material UI proporciona componentes accesibles por defecto
- El tema está optimizado para uso profesional
- Sin dependencias de backend (excepto el webhook para envío)
