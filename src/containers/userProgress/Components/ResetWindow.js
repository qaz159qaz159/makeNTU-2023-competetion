import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

function ResetWindow(props) {
  const { open, handleResetClose, handleResetAgree } = props;
  return (
    <Dialog
      open={open}
      onClose={handleResetClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">您確認要重置購物車嗎？</DialogTitle>

      <DialogActions>
        <Button onClick={handleResetClose}>否</Button>
        <Button onClick={handleResetAgree} autoFocus>
          是
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default ResetWindow;
