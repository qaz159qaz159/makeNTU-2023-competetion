import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {CardHeader, CardMedia} from "@mui/material";
import dpImg from "../../assets/images/3dp.jpg";
import {makeStyles} from "@mui/styles";
import LinearBuffer from "./linearProgress";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} timeout={2} {...props} />;
});

const useStyles = makeStyles(() => ({
    root: {
        background: "linear-gradient(45deg, #FFFFFF 30%, #FFFFFF 90%)",
        transitionDuration: "0.4s",
        border: "10px solid black",
        borderBlockColor: "azure",
        borderRadius: 3,
        boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
        color: "black",
        height: 48,
        padding: "0 30px",
        fontWeight: "bold",
        "&:hover": {
            background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
            color: "white",
        },
    },
    card: {
        "&:hover": {
            transform: "scale(1.1)",
            transition: "all 0.5s ease",
        },
    },
}));

export default function DPCard(props) {
    const {
        data,
        _new,
        authority,
        resetCard,
        setMachineList,
    } = props;

    // New Machine
    const [newMachineName, setNewMachineName] = React.useState("");
    const [newMachineTime, setNewMachineTime] = React.useState(0);
    const [newMachineOpen, setNewMachineOpen] = React.useState(false);
    // New Machine End

    // Delete Machine
    const [deleteMachineOpen, setDeleteMachineOpen] = React.useState(false);
    // Delete Machine End



    const classes = useStyles();

    const getState = () => {
        if (data.leftTime > 0 && data.active) {
            return (
                <CardHeader
                    title={"In Progress"}
                    style={{color: "white", backgroundColor: "red"}}
                />
            );
        } else if (data.leftTime <= 0 && data.active) {
            return (
                <CardHeader
                    title={"Finished"}
                    style={{color: "white", backgroundColor: "orange"}}
                />
            );
        } else {
            return (
                <CardHeader
                    title={"Enable"}
                    style={{color: "white", backgroundColor: "green"}}
                />
            );
        }
    };

    // New Machine
    const handleNewMachineClickOpen = () => {
        setNewMachineOpen(true);
    };

    const handleNewMachineClose = () => {
        setNewMachineOpen(false);
    };

    const handleNewMachine = () => {
        // TODO : Add New Machine
        setMachineList((prev) => {
            return [
                ...prev,
                {
                    name: newMachineName,
                    time: newMachineTime,
                    active: false,
                    leftTime: newMachineTime,
                    status: "idle",
                },
            ];
        });
        setNewMachineOpen(false);
    };
    // New Machine End

    // Delete Machine
    const handleDeleteMachineClickOpen = () => {
        setDeleteMachineOpen(true);
    };

    const handleDeleteMachineClose = () => {
        setDeleteMachineOpen(false);
    };

    const handleDeleteMachines = () => {
        // TODO : 刪除所有機器
        setMachineList([]);
    };

    const handleDeleteMachine = () => {
        // TODO : 刪除單一機器
        // console.log(e.target.value);
        // setMachineList((prev) => {
        //     return prev.filter((item) => item.name !== data.name);
        // });
        setDeleteMachineOpen(false);
    }
    // Delete Machine End



    const getCard = (_new) => {
        if (!_new) {
            return (
                <Card sx={{minWidth: 200}} className={classes.card}>
                    {getState()}
                    <CardMedia component="img" image={dpImg} alt="3DP"/>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Grid item xs={12}>
                                    <Typography
                                        sx={{fontSize: 20}}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        機台名稱：{data.name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        sx={{fontSize: 20}}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        組別：
                                        {data.userId === "-1" ? "無" : data.userId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        sx={{fontSize: 20}}
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        {data.userId === "-1"
                                            ? `時間：${data.time} 分鐘`
                                            : `剩餘時間：${data.leftTime} 分鐘`}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <LinearBuffer></LinearBuffer>
                    </CardContent>
                    <CardActions>
                        <Grid container spacing={2}>
                            {authority === 1 && (
                                <Grid item xs={4}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={handleDeleteMachineClickOpen}
                                        className={classes.root}
                                    >
                                        刪除
                                    </Button>
                                </Grid>
                            )}
                            {authority === 1 && (
                                <Grid item xs={4}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        onClick={() => resetCard(data.id)}
                                        className={classes.root}
                                    >
                                        結束
                                    </Button>
                                </Grid>
                            )}
                            {authority === 0 && (
                                <Grid item xs={4}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        className={classes.root}
                                    >
                                        預約
                                    </Button>
                                </Grid>
                            )}
                            {authority === 1 && (
                                <Grid item xs={4}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        className={classes.root}
                                    >
                                        安排
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </CardActions>
                </Card>
            );
        } else if (authority === 1) {
            return (
                <Card sx={{}}>
                    <CardActions>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleNewMachineClickOpen}
                                    style={{width: "100%", height: "100px"}}
                                >
                                    新增機台(SIGUSR1)
                                </Button>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleDeleteMachines}
                                    style={{width: "100%", height: "100px"}}
                                >
                                    清除機台(SIGUSR2)
                                </Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            );
        }
    };

    return (
        <>
            {getCard(_new)}
            {/*Deletion*/}
            <Dialog
                open={deleteMachineOpen}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{
                    style: {
                        backgroundColor: "black",
                        color: "white",
                        boxShadow: "none",
                        borderRadius: "10px",
                    },
                }}
            >
                <DialogTitle>
                    <Typography variant={"h3"} align={"center"}>
                        WARNING
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Typography variant={"h6"} align={"center"}>
                            將機台刪除可能會造成需要重新手動匯入。
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteMachineClose}>Disagree</Button>
                    <Button
                        onClick={handleDeleteMachine}
                        style={{border: "2px solid darkred"}}
                    >
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            {/*New*/}
            <Dialog open={newMachineOpen}>
                <DialogTitle>機台資訊</DialogTitle>
                <DialogContent>
                    <DialogContentText>請填寫欲新增之機台資訊！</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="機台名稱"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewMachineName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="使用時間(分鐘)"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setNewMachineTime(parseInt(e.target.value))}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewMachineClose}>取消</Button>
                    <Button onClick={handleNewMachine}>新增</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
