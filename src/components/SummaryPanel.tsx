import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Chip,
} from '@mui/material';
import { Quote } from '../types';

interface SummaryPanelProps {
  quote: Quote;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({ quote }) => {
  const formatCurrency = (amount: number) => `$${amount.toLocaleString()} MXN`;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom color="primary">
          Resumen de Cotización
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Total de m²: <strong>{quote.m2_total.toFixed(2)}</strong>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Base:</Typography>
          <Typography variant="body2">{formatCurrency(quote.base_mxn)}</Typography>
        </Box>

        {quote.instalacion_mxn > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Instalación:</Typography>
            <Typography variant="body2">{formatCurrency(quote.instalacion_mxn)}</Typography>
          </Box>
        )}

        {quote.recargo_urgencia_mxn > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Urgencia 24h (+30%):</Typography>
            <Typography variant="body2" color="warning.main">
              {formatCurrency(quote.recargo_urgencia_mxn)}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            Total Estimado:
          </Typography>
          <Chip
            label={formatCurrency(quote.total_estimado_mxn)}
            color="primary"
            size="medium"
            sx={{ fontWeight: 'bold', fontSize: '1.1rem', py: 1, px: 2 }}
          />
        </Box>

        <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
            Desglose:
          </Typography>
          <Typography
            variant="body2"
            component="pre"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: 1.4,
              whiteSpace: 'pre-wrap',
              color: 'text.secondary',
            }}
          >
            {quote.desglose_texto}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}>
          * Esta es una cotización estimada. El precio final puede variar según especificaciones detalladas.
        </Typography>
      </CardContent>
    </Card>
  );
};