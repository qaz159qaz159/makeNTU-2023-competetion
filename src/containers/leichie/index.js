import React from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
    
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection:'column', alignItems: 'center' }}>

        <Box sx={{ height: '100px', fontSize: 40, fontWeight: 'medium'}}>
            MakeNTU Laser Cutter
        </Box>

        <Box sx={{ width:'80%', height:280, border: 1}}>

        </Box>
        <Box sx={{ width:'80%', height:70, fontSize: 20, fontWeight: 'medium', display: 'flex' , justifyContent: 'space-between', alignItems: 'center' }}>
            <p>雷切機器數量：{laserNumber} 台</p>
            <p>時間上限：{laserTime} mins</p>
            <Box sx={{height:50}}>
                <TextField id="outlined-basic" label="輸入欲修改時間" variant="outlined" color="secondary"  
                    onChange = {(e) => {setTimeChange(e.target.value)}}
                    value = {timeChange}
                />
                <Button variant="contained" size='medium' color="secondary" endIcon={<SendIcon />} sx={{ height:57, color: 'black', backgroundColor : 'rgba(255,255,255,0.75)', fontSize: 16}}
                    disabled = {!timeChange}
                    onClick = { () => {
                        // console.log(timeChange);
                        setLaserTime(timeChange);
                        setTimeChange('');
                    }}
                >修改</Button>
            </Box>
        </Box>

        <Box sx={{ width: '50%', margin: 'auto', m: 2}}>
            <TableContainer component={Paper} sx={{height: 280}}>
                <Table sx={{ minWidth: 650}} aria-label="simple table">
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
