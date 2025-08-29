import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Controller, Control, useFieldArray } from 'react-hook-form';
import { FormData } from '../utils/validators';
import { MATERIALS } from '../utils/pricing';
import { calcItemM2 } from '../utils/calc';

interface ItemsTableProps {
  control: Control<FormData>;
  watch: any;
  setValue: any;
}

export const ItemsTable: React.FC<ItemsTableProps> = ({ control, watch, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedItems = watch('items') || [];

  // Recalcular m² cuando cambien los valores
  React.useEffect(() => {
    watchedItems.forEach((item: any, index: number) => {
      if (item && item.piezas && item.ancho_m && item.alto_m) {
        const newM2 = calcItemM2(item.piezas, item.ancho_m, item.alto_m);
        if (item.m2 !== newM2) {
          setValue(`items.${index}.m2`, newM2, { shouldTouch: true, shouldDirty: true, shouldValidate: true });
        }
      }
    });
  }, [watchedItems, setValue]);

  const addItem = () => {
    append({
      material: '',
      piezas: 1,
      ancho_m: 1,
      alto_m: 1,
      m2: 1,
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Ítems de la cotización</Typography>
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={addItem}
          size="small"
        >
          Agregar ítem
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Material</TableCell>
              <TableCell align="center">Piezas</TableCell>
              <TableCell align="center">Ancho (m)</TableCell>
              <TableCell align="center">Alto (m)</TableCell>
              <TableCell align="center">m²</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell sx={{ minWidth: 200 }}>
                  <Controller
                    name={`items.${index}.material`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth size="small" error={!!fieldState.error}>
                        <InputLabel>Material</InputLabel>
                        <Select {...field} label="Material">
                          {MATERIALS.map((material) => (
                            <MenuItem key={material.key} value={material.key}>
                              {material.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </TableCell>
                
                <TableCell sx={{ width: 100 }}>
                  <Controller
                    name={`items.${index}.piezas`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 1, step: 1 }}
                        error={!!fieldState.error}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </TableCell>

                <TableCell sx={{ width: 100 }}>
                  <Controller
                    name={`items.${index}.ancho_m`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0.1, step: 0.1 }}
                        error={!!fieldState.error}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0.1;
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </TableCell>

                <TableCell sx={{ width: 100 }}>
                  <Controller
                    name={`items.${index}.alto_m`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        size="small"
                        inputProps={{ min: 0.1, step: 0.1 }}
                        error={!!fieldState.error}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value) || 0.1;
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                </TableCell>

                <TableCell align="center" sx={{ width: 80 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {watchedItems[index]?.m2?.toFixed(2) || '0.00'}
                  </Typography>
                </TableCell>

                <TableCell align="center" sx={{ width: 60 }}>
                  <IconButton
                    onClick={() => remove(index)}
                    color="error"
                    size="small"
                    disabled={fields.length <= 1}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {fields.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            No hay ítems agregados. Presiona "Agregar ítem" para comenzar.
          </Typography>
        </Box>
      )}
    </Box>
  );
};