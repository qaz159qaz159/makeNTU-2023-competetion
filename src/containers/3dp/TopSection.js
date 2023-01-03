import React, {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {Element} from "react-scroll";
import {makeStyles} from "@mui/styles";
import {Grid, Paper, Typography} from "@mui/material/";
import {useHistory} from "react-router-dom";
import {selectSession} from "../../slices/sessionSlice";
import DPCard from "./card";
import {MachineAPI} from "../../api";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {FormControl} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SendIcon from "@mui/icons-material/Send";
import {useQuery, useMutation, useSubscription} from "@apollo/client";
import {
    CREATE_MACHINE_MUTATION,
    USER_RESERVE_MACHINE_MUTATION,
    USER_CANCEL_MACHINE_MUTATION,
    CLEAR_MACHINE_MUTATION,
    DELETE_MACHINE_MUTATION,
    MACHINE_UPDATE_SUBSCRIPTION,
    MACHINE_QUERY,
} from "../../graphql";

/**
 * This is Main Page
 */

export default function Top(props) {
    const {isLogin, authority} = useSelector(selectSession);
    const [userList, setUserList] = useState([]);

    const [waitings, setWaitings] = useState([]);
    const [readys, setReadys] = useState([]);

    const [usings, setUsings] = useState([]);
    const [finisheds, setFinisheds] = useState([]);
    const [machineList, setMachineList] = useState([]);

    const [createMachine] = useMutation(CREATE_MACHINE_MUTATION);
    const [clearMachine] = useMutation(CLEAR_MACHINE_MUTATION);
    const [deleteMachine] = useMutation(DELETE_MACHINE_MUTATION);
    const [userReserveMachine] = useMutation(USER_RESERVE_MACHINE_MUTATION);
    const [userCancelMachine] = useMutation(USER_CANCEL_MACHINE_MUTATION);
    const {data, loading, error, subscribeToMore} = useQuery(MACHINE_QUERY);

    useEffect(() => {
        try {
            subscribeToMore({
                document: MACHINE_UPDATE_SUBSCRIPTION,
                variables: {},
                updateQuery: (prev, {subscriptionData}) => {
                    if (!subscriptionData.data) return prev;
                    const newFeedItem = subscriptionData.data.machineUpdated;
                    return Object.assign({}, prev, {
                        machineList: [...prev.machineList, newFeedItem],
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, [subscribeToMore]);

    useEffect(() => {
        setWaitings([
            {name: "test", id: 1, leftTime: 20, active: true},
            {name: "test2", id: 2, leftTime: 2, active: true},
            {name: "test2", id: 3, leftTime: 10, active: true},
            {name: "test2", id: 4, leftTime: 200, active: true},
        ]);

        setReadys([
            {name: "test", id: 1, leftTime: 20, active: true},
            {name: "test2", id: 2, leftTime: 2, active: true},
            {name: "test2", id: 3, leftTime: 10, active: true},
            {name: "test2", id: 4, leftTime: 200, active: true},
        ]);

        setFinisheds([
            {name: "test", id: 1, leftTime: 20, active: true},
            {name: "test2", id: 2, leftTime: 2, active: true},
            {name: "test2", id: 3, leftTime: 10, active: true},
            {name: "test2", id: 4, leftTime: 200, active: true},
        ]);

        // idle inuse finished
        // setMachineList([
        //   {
        //     id: 0,
        //     name: "3D Printer 1",
        //     status: "idle",
        //     userId: 0,
        //     active: true,
        //     leftTime: 0,
        //     time: 0,
        //   },
        //   {
        //     id: 1,
        //     name: "3D Printer 2",
        //     status: "idle",
        //     userId: 1,
        //     active: true,
        //     leftTime: 0,
        //     time: 0,
        //   },
        //   {
        //     id: 2,
        //     name: "3D Printer 3",
        //     status: "idle",
        //     userId: 2,
        //     active: true,
        //     leftTime: 0,
        //     time: 0,
        //   },
        //   {
        //     id: 3,
        //     name: "3D Printer 4",
        //     status: "idle",
        //     userId: 3,
        //     active: true,
        //     leftTime: 0,
        //     time: 0,
        //   },
        //   {
        //     id: 4,
        //     name: "3D Printer 5",
        //     status: "idle",
        //     userId: 4,
        //     active: true,
        //     leftTime: 0,
        //     time: 0,
        //   },
        //   {
        //     id: 5,
        //     name: "3D Printer 6",
        //     status: "idle",
        //     userId: 5,
        //     active: true,
        //     leftTime: 0,
        //     time: 0,
        //   },
        // ]);

        setUserList([
            {name: "test", id: 1, leftTime: 20, active: true},
            {name: "test2", id: 2, leftTime: 2, active: true},
            {name: "test2", id: 3, leftTime: 10, active: true},
            {name: "test2", id: 4, leftTime: 200, active: true},
            {name: "test2", id: 5, leftTime: 200, active: true},
            {name: "test2", id: 6, leftTime: 200, active: true},
            {name: "test2", id: 7, leftTime: 200, active: true},
            {name: "test2", id: 8, leftTime: 200, active: true},
            {name: "test2", id: 0, leftTime: 200, active: true},
        ]);

        MachineAPI.getMachines().then((res) => {
            setMachineList(res.data);
        });
    }, []);

    // Arrange Machine
    const [arrangeMachineOpen, setArrangeMachineOpen] = React.useState(false);
    const [arrangeMachineName, setArrangeMachineName] = React.useState("");

    const [currentArrangeUser, setCurrentArrangeUser] = React.useState(-1);
    // Arrange Machine End

    // User Request
    const [userRequestOpen, setUserRequestOpen] = React.useState(false);
    const [userRequestFinish, setUserRequestFinish] = React.useState(false);
    const [userRequestState, setUserRequestState] = React.useState(-1); // -1: no 0: waiting, 1: ready, 2: using, 3: finished

    // User Request End

    const history = useHistory();
    const useStyles = makeStyles(() => ({
        root: {
            flexGrow: 1,
            width: "100%",
            height: "85vh",
            overflow: "auto",
        },
        paper: {
            background: "rgb(0,0,0,.0)",
            boxShadow: "none",
        },
        text: {
            margin: "auto",
            textAlign: "start",
            width: "80%",
        },
        time: {
            margin: "auto",
            color: "#F5DE83",
            textAlign: "end",
            width: "70%",
            fontWeight: "400",
        },
        block: {
            borderRadius: 3,
            border: "10px solid #1E1E1E",
            backgroundColor: "#1E1E1E",
        },
        subBlock: {
            border: "5px solid #121212",
        },
        waitingQueueHeader: {
            border: "5px solid #1E1E1E",
        },
    }));

    // Arrange Machine
    // TODO : Arrange Machine
    const handleArrangeMachine = () => {
        const currentUser = waitings.filter(
            (user) => user.id === currentArrangeUser
        )[0];
        setReadys([...readys, currentUser]);
        setWaitings((waitings) => {
            return waitings.filter((waiting) => {
                return waiting.id !== currentUser.id;
            });
        });
        const machineTime = machineList.filter(
            (machine) => machine.name === arrangeMachineName
        )[0].time;
        setUserList((userList) => {
            let newUserList = userList;
            newUserList.map((user) => {
                if (user.id === currentUser.id) {
                    user.active = true;
                    user.leftTime = machineTime;
                }
                return user;
            });
            return newUserList;
        });

        setMachineList((machineList) => {
            let newMachineList = machineList;
            newMachineList.map((machine) => {
                if (machine.name === arrangeMachineName) {
                    machine.status = "inuse";
                    machine.userId = currentUser.id;
                    machine.leftTime = machine.time;
                    machine.active = true;
                }
                return machine;
            });
            return newMachineList;
        });

        setCurrentArrangeUser(-1);
        setArrangeMachineOpen(false);
    };
    // Arrange Machine End

    // User Request
    const handleUserRequest = () => {
        userReserveMachine({
            variables: {
                input: {
                    teamId: 1,
                }
            }
        });
        setUserRequestFinish(true);
        setUserRequestOpen(false);
    };

    // User Request End

    const showMachineList = () => {
        let idleMachineList = machineList.filter(
            (machine) => machine.status === "idle"
        );
        return idleMachineList.map((machine) => {
            return <MenuItem value={machine.name}>{machine.name}</MenuItem>;
        });
    };

    const deleteCard = (id) => {
        console.log("deleteCard", id);
        setMachineList((machineList) =>
            machineList.filter((machine) => machine.id !== id)
        );
    };

    const resetCard = (id) => {
        setMachineList((machineList) => {
            let newMachineList = machineList;
            newMachineList.map((machine) => {
                if (machine.id === id) {
                    machine.active = false;
                    machine.leftTime = machine.time;
                }
                return machine;
            });
            return newMachineList;
        });
    };

    const classes = useStyles();
    return (
        <>
            {authority === 0 && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Button
                        variant="contained"
                        color="success"
                        style={{
                            width: "250px",
                            height: "250px",
                            borderRadius: "125px",
                            fontSize: "30px",
                        }}
                        endIcon={<SendIcon/>}
                        onClick={() => {
                            setUserRequestOpen(true);
                        }}
                    >
                        我要預約
                    </Button>
                </div>
            )}
            {authority === 0 && userRequestFinish && (
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "30px",
                    }}
                >
                    <h1 style={{color: "green"}}>預約成功</h1>
                </div>
            )}
            {authority === 1 && (
                <Element name="title">
                    <div className={classes.root}>
                        <Grid container spacing={2}>
                            {/**/}
                            <Grid item xs={10}>
                                <Grid container spacing={2}>
                                    {machineList.map((data, index) => (
                                        <Grid item xs={2}>
                                            <DPCard
                                                data={data}
                                                deleteCard={deleteCard}
                                                _new={false}
                                                authority={authority}
                                                setUserList={setUserList}
                                                resetCard={resetCard}
                                            />
                                        </Grid>
                                    ))}
                                    <Grid item xs={3}>
                                        <DPCard
                                            _new={true}
                                            authority={authority}
                                            setMachineList={setMachineList}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/*waiting queue*/}
                            <Grid item xs={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Paper className={classes.waitingQueueHeader}>
                                            <Typography
                                                variant="h6"
                                                style={{color: "#F5DE83", fontSize: "1.5rem"}}
                                                align={"center"}
                                            >
                                                Waiting Queue
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    {waitings.map((data, index) => (
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="body1"
                                                style={{
                                                    color: "black",
                                                    backgroundColor: "white",
                                                    fontSize: "1.5rem",
                                                    borderRadius: "5px",
                                                    height: "100%",
                                                }}
                                                align={"center"}
                                                onClick={() => {
                                                    setArrangeMachineOpen(true);
                                                    setCurrentArrangeUser(data.id);
                                                }}
                                            >
                                                {`${index} ${data.id}`}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                            {/*ready queue*/}
                            <Grid item xs={1}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Paper className={classes.waitingQueueHeader}>
                                            <Typography
                                                variant="h6"
                                                style={{color: "#F5DE83", fontSize: "1.5rem"}}
                                                align={"center"}
                                            >
                                                Ready Queue
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                    {readys.map((data, index) => (
                                        <Grid item xs={12}>
                                            <Typography
                                                variant="body1"
                                                style={{
                                                    color: "black",
                                                    backgroundColor: "white",
                                                    fontSize: "1.5rem",
                                                    borderRadius: "5px",
                                                    height: "100%",
                                                }}
                                                align={"center"}
                                            >
                                                {`${index} ${data.id}`}
                                            </Typography>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Element>
            )}
            <Dialog open={arrangeMachineOpen}>
                <DialogTitle>安排機台</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{height: "100px"}}>
                        請填寫欲新增之機台資訊！
                    </DialogContentText>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">選擇機台</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={arrangeMachineName}
                            label="arrangeMachineName"
                            onChange={(e) => setArrangeMachineName(e.target.value)}
                        >
                            {showMachineList()}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setArrangeMachineOpen(false)}>取消</Button>
                    <Button onClick={handleArrangeMachine}>安排</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={userRequestOpen}>
                <DialogTitle>預約機台</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{height: "100px"}}>
                        <div>總共有 {waitings.length + readys.length} 台機台</div>
                        <div>約需等待 {(waitings.length + readys.length) * 10} 分鐘</div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Button onClick={() => setUserRequestOpen(false)}>取消</Button>
                    <Button onClick={handleUserRequest}>預約</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
