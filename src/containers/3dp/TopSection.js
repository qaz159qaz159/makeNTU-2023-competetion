import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";
import { makeStyles } from "@mui/styles";
import { Grid, Paper, Typography } from "@mui/material/";
import { useHistory } from "react-router-dom";
import { selectSession } from "../../slices/sessionSlice";
import DPCard from "./card";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import SendIcon from "@mui/icons-material/Send";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import {
  CREATE_MACHINE_MUTATION,
  USER_RESERVE_MACHINE_MUTATION,
  USER_CANCEL_MACHINE_MUTATION,
  CLEAR_MACHINE_MUTATION,
  DELETE_MACHINE_MUTATION,
  ADMIN_UPDATE_USER_MUTATION,
  UPDATE_ALL_MUTATION,
  ADMIN_UPDATE_MACHINE,
  MACHINE_UPDATE_SUBSCRIPTION,
  USER_UPDATE_SUBSCRIPTION,
  MACHINE_QUERY,
  USER_QUERY,
} from "../../graphql";
// import Alert from '@mui/material/Alert';
/**
 * This is Main Page
 */

export default function Top(props) {
  const { isLogin, authority, teamID } = useSelector(selectSession);
  const [userList, setUserList] = useState([]);
  const [machineList, setMachineList] = useState([]);

  const [createMachine] = useMutation(CREATE_MACHINE_MUTATION);
  const [clearMachine] = useMutation(CLEAR_MACHINE_MUTATION);
  const [deleteMachine] = useMutation(DELETE_MACHINE_MUTATION);
  const [userReserveMachine] = useMutation(USER_RESERVE_MACHINE_MUTATION);
  const [userCancelMachine] = useMutation(USER_CANCEL_MACHINE_MUTATION);
  const [adminUpdateUser] = useMutation(ADMIN_UPDATE_USER_MUTATION);
  const [adminUpdateMachine] = useMutation(ADMIN_UPDATE_MACHINE);
  const [updateAll] = useMutation(UPDATE_ALL_MUTATION);

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
  const [finishUserOpen, setFinishUserOpen] = React.useState(false);
  const [finishUser, setFinishUser] = React.useState(-1);

  const { data, loading, error, subscribeToMore } = useQuery(MACHINE_QUERY);
  const {
    data: userData,
    loading: userLoading,
    subscribeToMore: userSubscribeToMore,
  } = useQuery(USER_QUERY);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    try {
      subscribeToMore({
        document: MACHINE_UPDATE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const machines = subscriptionData.data.machineUpdated;
          // setCounter(counter + 1);
          // console.log("machineUpdated", data.machine);
          return Object.assign({}, prev, {
            machines: machines,
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [subscribeToMore]);

  useEffect(() => {
    try {
      userSubscribeToMore({
        document: USER_UPDATE_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const users = subscriptionData.data.userUpdated;
          setUserList(users);
          return users;
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [userSubscribeToMore]);

  useEffect(() => {
    updateAll();
  }, []);

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
    const currentUser = userData.user.filter(
      (user) => user.id === currentArrangeUser
    )[0];

    adminUpdateUser({
      variables: {
        input: {
          teamId: currentUser.teamId,
          status: 1,
          machineName: arrangeMachineName,
        },
      },
    });

    setCurrentArrangeUser(-1);
    setArrangeMachineOpen(false);
  };
  // Arrange Machine End

  // User Request
  const handleUserRequest = () => {
    console.log(parseInt(teamID));
    userReserveMachine({
      variables: {
        input: {
          teamId: parseInt(teamID),
        },
      },
    });
    setUserRequestFinish(true);
    setUserRequestOpen(false);
  };

  // User Request End

  const showMachineList = () => {
    let idleMachineList = data.machine.filter(
      (machine) => machine.status === -1
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

  const resetCard = (name) => {
    adminUpdateMachine({
      variables: {
        input: {
          name: name,
          status: -1,
        },
      },
    });
  };

  const handleFinishUser = () => {
    const currentUser = userData.user.filter(
      (user) => user.id === finishUser
    )[0];
    adminUpdateUser({
      variables: {
        input: {
          teamId: currentUser.teamId,
          status: 0,
        },
      },
    });
    setFinishUserOpen(false);
  };

  const showWaitingQueue = () => {
    // console.log(userList);
    let waitingQueue = userData.user.filter((user) => user.status === 0);
    return waitingQueue.map((data, index) => (
      <Grid item xs={12}>
        <Typography
          variant="body1"
          style={{
            color: "black",
            backgroundColor: "white",
            fontSize: "1rem",
            borderRadius: "5px",
            height: "100%",
          }}
          align={"center"}
          onClick={() => {
            setArrangeMachineOpen(true);
            setCurrentArrangeUser(data.id);
          }}
        >
          <p>順序：{index}</p>
          <p>隊伍：{data.teamId}</p>
        </Typography>
      </Grid>
    ));
  };
  const showReadyQueue = () => {
    let readyQueue = userData.user.filter((user) => user.status === 1);
    return readyQueue.map((data, index) => (
      <Grid item xs={12}>
        <Typography
          variant="body1"
          style={{
            color: "black",
            backgroundColor: "white",
            fontSize: "1rem",
            borderRadius: "5px",
            height: "100%",
          }}
          align={"center"}
          onClick={() => {
            setFinishUserOpen(true);
            setFinishUser(data.id);
          }}
        >
          <p>順序：{index}</p>
          <p>隊伍：{data.teamId}</p>
        </Typography>
      </Grid>
    ));
  };

  const classes = useStyles();

  if (loading || userLoading) return "Loading...";

  return (
    <>
      {authority === 1 && (
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
            endIcon={<SendIcon />}
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
          <h1 style={{ color: "green" }}>預約成功</h1>
        </div>
      )}
      {authority === 1 && (
        <Element name="title">
          {/*<div className={classes.root}>*/}
          <Grid container spacing={2}>
            {/**/}
            <Grid item xs={10}>
              <Grid container spacing={2}>
                {data.machine.map((data, index) => (
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
                      // variant="h6"
                      style={{ color: "#F5DE83", fontSize: "1.5rem" }}
                      align={"center"}
                    >
                      Waiting Queue
                    </Typography>
                  </Paper>
                </Grid>
                {showWaitingQueue()}
              </Grid>
            </Grid>
            {/*ready queue*/}
            <Grid item xs={1}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper className={classes.waitingQueueHeader}>
                    <Typography
                      // variant="h6"
                      style={{ color: "#F5DE83", fontSize: "1.5rem" }}
                      align={"center"}
                    >
                      Ready Queue
                    </Typography>
                  </Paper>
                </Grid>
                {showReadyQueue()}
              </Grid>
            </Grid>
          </Grid>
          {/*</div>*/}
        </Element>
      )}
      <Dialog open={arrangeMachineOpen}>
        <DialogTitle>安排機台</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            請安排機台！
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
          <DialogContentText style={{ height: "100px" }}>
            <div>總共有 {data.machine.length} 台機台</div>
            <div>
              約需等待 {(userData.user.length * 10) / data.machine.length} 分鐘
            </div>
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
      <Dialog open={finishUserOpen}>
        <DialogTitle>結束</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ height: "100px" }}>
            請結束機台！
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFinishUserOpen(false)}>取消</Button>
          <Button onClick={handleFinishUser}>安排</Button>
        </DialogActions>
      </Dialog>
      {/*<Alert>This is an info alert — check it out!</Alert>*/}
    </>
  );
}
