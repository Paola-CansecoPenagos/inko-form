import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { Phone, Email } from '@mui/icons-material';
import { CONTACT_INFO } from '../utils/pricing';

export const BrandHeader: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <img
          src="/lovable-uploads/f3b3db4a-2991-4c60-aacb-866698e32f65.png"
          alt="INKO Impresores Logo"
          style={{
            height: '60px',
            width: 'auto',
            objectFit: 'contain',
          }}
        />
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            INKO Impresores
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Solicitud de cotización
          </Typography>
        </Box>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
        <Chip
          icon={<Phone />}
          label={CONTACT_INFO.phone}
          variant="outlined"
          color="primary"
          size="small"
        />
        <Chip
          icon={<Email />}
          label={CONTACT_INFO.email}
          variant="outlined"
          color="primary"
          size="small"
        />
      </Stack>
    </Box>
  );
};