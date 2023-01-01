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
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { bgcolor, width } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
// --- Table info ---
function createData(team, order, material, thickness, arrangement) {
  return { team, order, material, thickness, arrangement };
}

const rows = [
  createData("Team 1", 1, "壓克力", 3, "15:30"),
  createData("Team 2", 2, "密集板", 5, "15:50"),
  createData("Team 3", 3, "密集板", 5, "16:00"),
  createData("Team 4", 4, "壓克力", 3, "16:10"),
  createData("Team 5", 5, "密集板", 5, "16:20"),
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  // height: '200px',
}));
// --- --- ---
export default function LaserCutter() {
  // --- States ---
  const [laserNumber, setLaserNumber] = useState(2);
  const [laserTime, setLaserTime] = useState(20);
  const [open, setOpen] = useState(false); // 開啟預約管理
  const [reserved, setReserved] = useState(false); // 是否已預約借用
  const [material, setMaterial] = useState(1); // 預約雷切機 材料
  const [thickness, setThickness] = useState(1); // 預約雷切機 厚度

  const handleOpen = () => setOpen(true); // 開啟預約雷切機
  const handleClose = () => setOpen(false); // 關閉預約雷切機

  const modalStyle = {
    display: "flex",
    flexWrap: "wrap",
    border: "0.5px solid #fff",
    boxShadow: 24,
    p: 3,
  };

  // 借用登記
  const borrowForm = (
    <>
      <Box component="form" sx={modalStyle}>
        <FormControl>
          {/* 選取材料 */}
          <InputLabel id="demo-simple-select-label">材料</InputLabel>
          <Select
            inputProps={{
              MenuProps: {
                MenuListProps: {
                  sx: {
                    backgroundColor: "black",
                  },
                },
              },
            }}
            variant="standard"
            value={material}
            label="材料"
            defaultValue="1"
            onChange={(e) => {
              setMaterial(e.target.value);
            }}
          >
            <MenuItem value={1}>壓克力</MenuItem>
            <MenuItem value={2}>密集板</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          {/* 選取厚度 */}
          <InputLabel id="demo-simple-select-label">厚度</InputLabel>
          <Select
            inputProps={{
              MenuProps: {
                MenuListProps: {
                  sx: {
                    backgroundColor: "black",
                  },
                },
              },
            }}
            variant="standard"
            value={thickness}
            label="厚度"
            defaultValue="1"
            onChange={(e) => {
              setThickness(e.target.value);
            }}
          >
            <MenuItem value={1}>5 mm</MenuItem>
            <MenuItem value={2}>3 mm</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DialogActions sx={{ bgcolor: "rgba(0,0,0)" }}>
        <Button onClick={handleClose}>離開</Button>
        <Button
          onClick={() => {
            setReserved(true); // 使用完成後要設定為false
          }}
        >
          送出
        </Button>
      </DialogActions>
    </>
  );

  // 已登記借用/取消借用
  const cancelFrom = (
    <>
      <Box component="form" sx={modalStyle}>
        <Typography>
          已登記借用：
          {material == 1 ? "壓克力" : material == 2 ? "密集板" : "NA"}（
          {thickness == 1 ? "5 mm" : thickness == 2 ? "3 mm" : "NA"}）
        </Typography>
      </Box>
      <DialogActions sx={{ bgcolor: "rgba(0,0,0)" }}>
        <Button
          onClick={() => {
            setReserved(false);
          }}
        >
          取消預約
        </Button>
        <Button onClick={handleClose}>Ok</Button>
      </DialogActions>
    </>
  );
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
          fontSize: 30,
          fontWeight: "medium",
          justifyContent: "space-between",
        }}
      >
        <p>雷射切割機 借用情況</p>
        <Button
          size="large"
          sx={{ color: "rgba(255,255,255)" }}
          startIcon={<EditIcon />}
          onClick={handleOpen}
        >
          預約管理
        </Button>
        {/* 新增雷切機的視窗 */}
        <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
          <DialogTitle sx={{ bgcolor: "rgba(0,0,0)" }}>借用資訊</DialogTitle>
          <DialogContent sx={{ bgcolor: "rgba(0,0,0)" }}>
            {reserved ? cancelFrom : borrowForm}
          </DialogContent>
        </Dialog>
      </Box>

      <Box sx={{ width: "90%", border: 1 }}>
        <LaserCutterBox />
      </Box>
      <Stack
        direction="row"
        sx={{
          width: "90%",
          height: 80,
          fontSize: 20,
          fontWeight: "medium",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>雷切機數量：{laserNumber} 台</p>
        <p>使用時間上限：{laserTime} mins</p>
      </Stack>

      <Box sx={{ width: "80%", margin: "auto", m: 2 }}>
        <TableContainer component={Paper} sx={{ height: 280 }}>
          <Table
            stickyHeader
            sx={{ minWidth: "80%" }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">組別 </TableCell>
                <TableCell align="center">排序</TableCell>
                <TableCell align="center">材料</TableCell>
                <TableCell align="center">厚度</TableCell>
                <TableCell align="center">預計使用</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.team}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {row.team}
                  </TableCell>
                  <TableCell align="center">{row.order}</TableCell>
                  <TableCell align="center">{row.material}</TableCell>
                  <TableCell align="center">{row.thickness}</TableCell>
                  <TableCell align="center">{row.arrangement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
