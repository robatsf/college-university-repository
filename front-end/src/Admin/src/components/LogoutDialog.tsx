// src/components/LogoutDialog.tsx
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material';

export const LogoutDialog = ({ open, onClose, onConfirm }) => (
  <Dialog 
    open={open} 
    onClose={onClose}
    sx={{
      '& .MuiDialog-paper': {
        borderRadius: 2,
        padding: 2,
      },
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(4px)',
      },
    }}
  >
    <DialogTitle>Confirm Logout</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to logout?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Logout
      </Button>
    </DialogActions>
  </Dialog>
);