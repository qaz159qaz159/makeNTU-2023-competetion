import LaserCutterBox from "./leichieBox";
import React from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";

// --- Table info ---
function createData(team, order, material, thickness, arrangement) {
  return { team, order, material, thickness, arrangement };
}

const rows = [
  createData('Team 1', 1, "壓克力", 3, "雷切一"),
  createData('Team 2', 2, "密集板", 5, "雷切二"),
  createData('Team 3', 3, "密集板", 5, "無"),
  createData('Team 4', 4, "壓克力", 3, "無"),
  createData('Team 5', 5, "密集板", 5, "無"),
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  // height: '200px',
}));
// --- --- ---
export default function LaserCutter() {
  // --- States ---
  const [laserNumber, setLaserNumber] = useState(2);
  const [laserTime, setLaserTime] = useState(20);
  const [timeChange, setTimeChange] = useState(20);
  const [laserNo, setLaserNo] = useState(""); // 雷切機編號
  const [open, setOpen] = useState(false); // 新增雷切機
  const handleOpen = () => setOpen(true); // 開啟新增雷切機
  const handleClose = () => setOpen(false); // 關閉新增雷切機
  const handleConfirm = () => {
    setOpen(false);
  };
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "rgba(0,0,0, 0.7)",

    border: "1px solid #fff",
    boxShadow: 24,
    p: 3,
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "auto",
          width: "90%",
          display: "flex",
          fontSize: 40,
          fontWeight: "medium",
          justifyContent: "space-between",
        }}
      >
        <p>雷射切割機 借用管理</p>
        <Button
          size="large"
          sx={{ color: "rgba(255,255,255)", fontSize: 16 }}
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          新增雷切機
        </Button>
        {/* 新增雷切機的視窗 */}
        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle} component="form">
            <Stack direction="column" spacing={2}>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                新增雷切機：
              </Typography>
              <Stack direction="row" spacing={2} alignItems="baseline">
                <TextField
                  required
                  label="機台編號"
                  variant="standard"
                  onChange={(e) => setLaserNo(e.target.value.trim())}
                  value={laserNo}
                  defaultValue="A"
                  helperText={laserNo ? "" : "必填"}
                />

                <Button
                  disabled={!laserNo}
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255, 0.7)",
                    color: "black",
                    borderRadius: 10,
                  }}
                  onClick={handleConfirm}
                >
                  確認
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255,255,255, 0.7)",
                    color: "black",
                    borderRadius: 10,
                  }}
                  onClick={handleClose}
                >
                  取消
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Box>

      <Box sx={{ width: "90%", border: 1 }}>
        <LaserCutterBox />
      </Box>
      <Stack direction="row" 
        sx={{ width: '90%', height: 80, fontSize: 20, fontWeight: 'medium', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>雷切機數量：{laserNumber} 台</p>
        <p>時間上限：{laserTime} mins</p>
        <Stack direction="row"  sx={{ height: 50 }}>
          <TextField id="outlined-basic" label="輸入欲修改時間" variant="outlined" color="secondary"
            onChange={(e) => { setTimeChange(e.target.value) }}
            value={timeChange}
          />
          <Button variant="contained" size='small' color="secondary" endIcon={<SendIcon />} sx={{ height: 57, color: 'black', backgroundColor: 'rgba(255,255,255,0.75)', fontSize: 16 }}
            disabled={!timeChange}
            onClick={() => {
              // console.log(timeChange);
              setLaserTime(timeChange);
              setTimeChange('');
            }}
          >修改</Button>
        </Stack>
      </Stack>

      <Box sx={{ width: '80%', margin: 'auto', m: 2 }}>
        <TableContainer component={Paper} sx={{ height: 280 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell> 組別 </TableCell>
                <TableCell align="right">排序</TableCell>
                <TableCell align="right">材料</TableCell>
                <TableCell align="right">厚度</TableCell>
                <TableCell align="right">排程</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.team}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{row.team}</TableCell>
                  <TableCell align="right">{row.order}</TableCell>
                  <TableCell align="right">{row.material}</TableCell>
                  <TableCell align="right">{row.thickness}</TableCell>
                  <TableCell align="right">{row.arrangement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

// export default function LaserCutter() {
//   return (
//   <LaserCutterCard />
//   );
// }
