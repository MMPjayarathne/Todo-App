import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const ConfirmationDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ "& .MuiDialog-paper": { borderRadius: 4, padding: 3 } }}>
      <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2' }}>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            padding: '6px 16px',
            fontSize: '1rem',
            marginRight: 2,
            '&:hover': { backgroundColor: '#f0f0f0' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          sx={{
            borderRadius: 20,
            textTransform: 'none',
            padding: '6px 16px',
            fontSize: '1rem',
            '&:hover': { backgroundColor: '#d32f2f' }
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
