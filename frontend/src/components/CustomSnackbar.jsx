import React, { useEffect } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const CustomSnackbar = ({ open, message, severity, onClose }) => {
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        onClose();
      }, 6000); 
    }
  }, [open, onClose]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
      sx={{
        zIndex: (theme) => theme.zIndex.snackbar + 1,
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          fontSize: '1.2rem',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: 3,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
