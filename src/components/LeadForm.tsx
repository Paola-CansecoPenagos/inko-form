import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormData, formSchema } from '../utils/validators';
import { computeQuote } from '../utils/calc';
import { MATERIALS } from '../utils/pricing';
import { LeadPayload } from '../types';
import { sendLead } from '../api/sendLead';
import { ItemsTable } from './ItemsTable';
import { SummaryPanel } from './SummaryPanel';
import { ConsentText } from './ConsentText';

export const LeadForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      empresa: '',
      medio_preferido: 'WhatsApp',
      descripcion_breve: '',
      instalacion: false,
      ubicacion_instalacion: '',
      urgente_24h: false,
      fecha_objetivo: '',
      items: [
        {
          material: '',
          piezas: 1,
          ancho_m: 1,
          alto_m: 1,
          m2: 1,
        },
      ],
      link_archivos: '',
      consentimiento: false,
    },
    mode: 'onChange',
  });

  const watchedValues = watch();
  const watchedInstalacion = watch('instalacion');
  const watchedConsentimiento = watch('consentimiento');

  // Calcular cotización en tiempo real
  const quote = useMemo(() => {
    if (!watchedValues.items || watchedValues.items.length === 0) {
      return {
        m2_total: 0,
        base_mxn: 0,
        instalacion_mxn: 0,
        recargo_urgencia_mxn: 0,
        total_estimado_mxn: 0,
        desglose_texto: 'Agrega ítems para ver la cotización',
      };
    }

    const itemsWithMaterialKeys = watchedValues.items
      .filter(item => item.material && item.piezas && item.ancho_m && item.alto_m)
      .map(item => ({
        materialKey: item.material,
        piezas: item.piezas,
        ancho_m: item.ancho_m,
        alto_m: item.alto_m,
      }));

    if (itemsWithMaterialKeys.length === 0) {
      return {
        m2_total: 0,
        base_mxn: 0,
        instalacion_mxn: 0,
        recargo_urgencia_mxn: 0,
        total_estimado_mxn: 0,
        desglose_texto: 'Completa los ítems para ver la cotización',
      };
    }

    return computeQuote({
      items: itemsWithMaterialKeys,
      instalacion: watchedValues.instalacion || false,
      urgente_24h: watchedValues.urgente_24h || false,
    });
  }, [watchedValues.items, watchedValues.instalacion, watchedValues.urgente_24h]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Construir payload con labels de materiales
      const itemsWithLabels = data.items.map(item => {
        const material = MATERIALS.find(m => m.key === item.material);
        return {
          material: material?.label || item.material,
          piezas: item.piezas,
          ancho_m: item.ancho_m,
          alto_m: item.alto_m,
          m2: item.m2,
        };
      });

      const payload: LeadPayload = {
        lead: {
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          empresa: data.empresa || undefined,
          canal_origen: 'form',
          medio_preferido: data.medio_preferido,
        },
        requerimiento: {
          descripcion_breve: data.descripcion_breve,
          instalacion: data.instalacion,
          ubicacion_instalacion: data.instalacion ? data.ubicacion_instalacion : null,
          urgente_24h: data.urgente_24h,
          fecha_objetivo: data.urgente_24h ? null : (data.fecha_objetivo || null),
          items: itemsWithLabels,
        },
        cotizacion_cliente: {
          m2_total: quote.m2_total,
          base_mxn: quote.base_mxn,
          instalacion_mxn: quote.instalacion_mxn,
          recargo_urgencia_mxn: quote.recargo_urgencia_mxn,
          total_estimado_mxn: quote.total_estimado_mxn,
          desglose_texto: quote.desglose_texto,
        },
      };

      await sendLead(payload);
      
      setSnackbar({
        open: true,
        message: '¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.',
        severity: 'success',
      });
      
      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Error al enviar la solicitud',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Datos del solicitante
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="nombre"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Nombre completo"
                      fullWidth
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="telefono"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Teléfono (10 dígitos)"
                      inputProps={{ inputMode: 'tel', pattern: '[0-9]*' }}
                      fullWidth
                      required
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Box>
              
              <Box sx={{ flex: '1 1 300px' }}>
                <Controller
                  name="empresa"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Empresa (opcional)"
                      fullWidth
                    />
                  )}
                />
              </Box>
            </Box>
            
            <Box sx={{ maxWidth: 300 }}>
              <Controller
                name="medio_preferido"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Medio de contacto preferido</InputLabel>
                    <Select {...field} label="Medio de contacto preferido">
                      <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                      <MenuItem value="Email">Email</MenuItem>
                      <MenuItem value="Llamada">Llamada telefónica</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Requerimiento
          </Typography>
          
          <Stack spacing={2}>
            <Controller
              name="descripcion_breve"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Descripción del proyecto"
                  multiline
                  rows={3}
                  fullWidth
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="Describe brevemente tu proyecto de impresión..."
                />
              )}
            />
            
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Controller
                  name="instalacion"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Requiere instalación"
                    />
                  )}
                />
                
                {watchedInstalacion && (
                  <Box sx={{ mt: 2 }}>
                    <Controller
                      name="ubicacion_instalacion"
                      control={control}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          label="Ubicación para instalación"
                          fullWidth
                          required
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          sx={{ minWidth: 300 }}
                        />
                      )}
                    />
                  </Box>
                )}
              </Box>
              
              <Box>
                <Controller
                  name="urgente_24h"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} color="warning" />}
                      label="Urgente (24 horas) +30%"
                    />
                  )}
                />
                
                {!watch('urgente_24h') && (
                  <Box sx={{ mt: 2 }}>
                    <Controller
                      name="fecha_objetivo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Fecha objetivo (opcional)"
                          type="date"
                          InputLabelProps={{ shrink: true }}
                          sx={{ minWidth: 200 }}
                        />
                      )}
                    />
                  </Box>
                )}
              </Box>
            </Box>
            
            <Controller
              name="link_archivos"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Link a archivos (opcional)"
                  fullWidth
                  placeholder="Google Drive, Dropbox, etc."
                />
              )}
            />
          </Stack>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <ItemsTable control={control} watch={watch} setValue={setValue} />
        </CardContent>
      </Card>

      <SummaryPanel quote={quote} />

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <ConsentText 
            control={control} 
            error={errors.consentimiento?.message} 
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
              disabled={!isValid || !watchedConsentimiento || isSubmitting}
              sx={{ minWidth: 200 }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar solicitud'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};