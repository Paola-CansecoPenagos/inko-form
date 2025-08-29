# INKO Impresores - Sistema de Cotización
Inicio de proyecto: Jueves 28 de agosto de 2025 a las 7 pm - Termino de proyecto: Viernes 29 de agosto de 2025 a las 3:30 pm

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
   VITE_N8N_WEBHOOK_URL
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

## Retos que enfrenté

### CORS entre Replit/Lovable y n8n Cloud

El preflight OPTIONS fallaba en el endpoint webhook-test, esto lo resolví activando el flujo y usando la Production URL (/webhook/...) + headers CORS (Access-Control-Allow-Origin/Methods/Headers).

### Forma del payload en n8n

El Webhook entrega los datos como json.body (o a veces raw string), para ello añadí una extracción robusta para soportar req.body, raíz o string JSON, evitando "Faltan campos…" falsos.

### Formateo y redondeo de moneda

Uniformé redondeo a 2 decimales y formateo es-MX (miles/decimales) en el correo para evitar confusiones.

## ¿Qué mejoraría con más tiempo?

### Robustez y calidad

**Validación de esquema end-to-end**: ya valido en frontend con Zod; replicaría el mismo schema en n8n (Code) para defensa en profundidad y mensajes de error consistentes.

**Idempotencia**: generar un lead_id (hash por email+timestamp) y evitar duplicados en Sheets si el usuario reintenta.

**Reintentos y fallback**: si la IA falla o no devuelve JSON, degradar a "Medio" + copy por defecto y enviar igual la notificación; loguear para revisar.

**Observabilidad**: métricas de tiempo de respuesta, % fallos de IA, totales por material, conversión por canal. Alertas (Slack/Email) ante errores.

### Seguridad y cumplimiento

**CORS con whitelist** de dominios (no * en producción).

**Anti-spam/abuso**: reCAPTCHA/Turnstile, rate limiting y validación de teléfono/email.

**PII**: evitar loguear correos/teléfonos en mensajes de error; política de retención de datos; variables de entorno separadas por ambiente.

### Datos y escalabilidad

**Persistencia**: mantener Sheets (rápido para prototipo) pero planear migración a DB (Supabase/Airtable/Postgres) para concurrencia, búsqueda y reportes.

**Catálogo gestionable**: mover precios/materiales a una Sheet "Catálogo" o CMS ligero y leerlos desde n8n para no redeployar por cambios.

**Respuesta al cliente**: además del correo a INKO, enviar confirmación al lead (email/WhatsApp) con su resumen y número de seguimiento.

**Internacionalización/moneda**: bloquear MXN y formato es-MX, pero dejar lista la capa para i18n si crece.

### Prompting y costos IA

**Hardening del prompt**: reforzar el contrato JSON (sin texto extra), ejemplos positivos/negativos y penalizar alucinaciones.

**Budget control**: logs de consumo y límites diarios por ambiente.

**Función "clasificar sin contexto sensible"**: sólo enviar lo necesario a la IA (minimizar PII).

### Entrega técnica

**Infra por ambientes**: dev (webhook-test) y prod (webhook), variables .env distintas y checklists de despliegue.

**Documentación**: diagrama del flujo, contratos de entrada/salida y guía de operación (cómo rotar claves, cómo cambiar catálogo, cómo ver fallas).
