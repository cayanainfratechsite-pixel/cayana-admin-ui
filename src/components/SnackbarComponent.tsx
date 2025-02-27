import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface SnackbarComponentProps {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
}

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }} 
      sx={{
        "& .MuiSnackbarContent-root": {
          padding: "20px", 
          fontSize: "1.2rem", 
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: "100%", 
          // padding: "16px 24px", 
          // fontSize: "1rem", 
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
