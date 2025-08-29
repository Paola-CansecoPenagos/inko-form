import React from 'react';
import { Container, Box } from '@mui/material';
import { BrandHeader } from './components/BrandHeader';
import { LeadForm } from './components/LeadForm';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BrandHeader />
      <LeadForm />
    </Container>
  );
};

export default App;
