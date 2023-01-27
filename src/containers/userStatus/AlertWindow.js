import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

function AlertWindow(props) {
  const { open, handleAlertClose, handleAlertAgree } = props;
  return (
    <Dialog
      open={open}
      onClose={handleAlertClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">您確認要取消申請嗎?</DialogTitle>

      <DialogActions>
        <Button onClick={handleAlertClose} variant="contained">
          No
        </Button>
        <Button onClick={handleAlertAgree} autoFocus variant="contained">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AlertWindow;
