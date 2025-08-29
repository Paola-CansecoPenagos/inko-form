import React from 'react';
import { FormControlLabel, Checkbox, Typography, Box } from '@mui/material';
import { Controller, Control } from 'react-hook-form';
import { FormData } from '../utils/validators';

interface ConsentTextProps {
  control: Control<FormData>;
  error?: string;
}

export const ConsentText: React.FC<ConsentTextProps> = ({ control, error }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Controller
        name="consentimiento"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                checked={field.value || false}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Autorizo el contacto y tratamiento de mis datos personales para fines comerciales
                conforme a la Ley de Protección de Datos Personales.
              </Typography>
            }
          />
        )}
      />
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};