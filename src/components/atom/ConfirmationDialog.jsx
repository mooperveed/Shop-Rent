import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

export const ConfirmationDialog = ({ open, onClose, onConfirm, title, content, isConfirming }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus disabled={isConfirming}>
          {isConfirming ? 'Confirming...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};



