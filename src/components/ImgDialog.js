import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ImgDialog(props) {
  const { uploadImg, setOpenDialog, open } = props;
  const [myURL, setMyURL] = React.useState("");
  const handleClose = (link) => {
    setMyURL("");
    setOpenDialog(false);
  };
  // open, isOpen,
  //  <Dialog open={open} onClose={handleClose}></Dialog>
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <DialogContentText>請貼上圖片的網址</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="img"
            name="img"
            fullWidth
            variant="standard"
            value={myURL}
            onChange={(e) => setMyURL(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Cancel
          </Button>
          <Button onClick={() => uploadImg(myURL)} variant="contained">
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
