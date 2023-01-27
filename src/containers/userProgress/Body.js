import * as React from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import SearchBar from "./Components/SearchBar";
import Card from "./Components/Cards";
import ResetWindow from "./Components/ResetWindow";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectSession } from "../../slices/sessionSlice";
import { useMakeNTU } from "../../hooks/useMakeNTU";

const steps = ["挑選開發版", "確認並送出", "申請結果"];

var needList = {};

const Wrapper = styled.div`
  width: 100%;
  height: calc(74vh - 80px);
  margin: 5px 0 5px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;
  //overflow-y: hidden;
`;

function Body() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [rerender, setRerender] = React.useState(false);
  const [searchWord, setSearchWord] = React.useState("");
  const [searchMethod, setSearchMethod] = React.useState("Name");
  //const [needList, setNeedList] = React.useState({});
  const [userCardData, setUserCardData] = React.useState([]);
  const [ableNext, setAbleNext] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const [resetOpen, setResetOpen] = React.useState(false);
  const {
    userBoardINIT,
    sendData,
    getUser,
    cardData,
    userRequest,
    userCards,
    userProgressStatus,
    subscribe,
  } = useMakeNTU();
  const { teamID, authority } = useSelector(selectSession);

  useEffect(() => {
    getUser(teamID);
    subscribe({ id: teamID, authority: authority, page: "userProgress" });
    needList = {};
  }, []);
  useEffect(() => {
    setUserCardData(
      cardData.map((e) => {
        e.needList = needList;
        return e;
      })
    );
    setRerender(false);
  }, [needList, cardData, rerender, userProgressStatus]);
  useEffect(() => {
    setOrders(order(userProgressStatus));
  }, [userProgressStatus]);

  useEffect(() => {
    needList = {};
  }, [teamID]);

  const addNeedList = (name, quantity) => {
    if (quantity === 0) {
      delete needList[name];
    } else {
      needList[name] = quantity;
    }
    //// console.log([...needList]);
    setAbleNext(Object.keys(needList).length !== 0);
  };

  const handleNext = () => {
    //// console.log(userRequest, userCards);
    if (activeStep === steps.length - 1) {
      reset();
      return;
    } else if (activeStep === steps.length - 2) {
      let requestBody = [];
      let group = teamID;

      // for (var [key, value] of needList.entries()) {
      //   requestBody.push([key, value]);
      // }
      Object.keys(needList).forEach(function (key) {
        requestBody.push([key, needList[key]]);
      });
      // // console.log({ group, requestBody });
      sendData(["REQUEST", { group, requestBody }]);
    }

    // console.log("User " + teamID);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setResetOpen(true);
  };
  const handleResetClose = () => {
    // console.log("算了");
    setResetOpen(false);
  };
  const reset = () => {
    // console.log("重置");
    needList = {};
    setUserCardData([]);
    setActiveStep(0);
    setRerender(true);
    setResetOpen(false);
  };

  const order = (servermsg) => {
    let a = servermsg;
    // for (var [key, value] of needList.entries()) {
    //   a.push("板子 : " + key + "  申請" + value + "個");
    // }
    if (a.length === 2) {
      a = ["Warning!!!!!  Something wrong!!!!!", ...a];
    }

    if (a.length === 1) {
      Object.keys(needList).forEach(function (key) {
        a.push(key + "  申請" + needList[key] + "個");
      });
      a.push("-----銘謝惠顧-----");
    }
    //// console.log(a);

    return a;
  };

  useEffect(() => {
    setRerender(false);
  }, [rerender]);

  useEffect(() => {
    let payload = 0;
    userBoardINIT(payload);
  }, [rerender]);

  const calcuLimit = (limit, boardName) => {
    let groupLimit = limit;

    if (userCards[boardName]) {
      groupLimit -= userCards[boardName];
    }

    userRequest.map((rq) => {
      if (rq.status === "pending") {
        //// console.log(boardName);
        rq.requestBody.map((rb) => {
          if (rb.board === boardName) {
            groupLimit -= rb.quantity;
          }
        });
      }
    });
    //// console.log(groupLimit);
    return groupLimit;
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box mb={2}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      {activeStep === steps.length - 1 ? (
        <Wrapper>
          <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
            <Grid item xs={12} md={6}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                All steps completed (you&apos;re finished)
                <br></br>
                This is your order list:
              </Typography>
              <List dense={false}>
                {orders.map((e) => {
                  return (
                    <ListItem key={e}>
                      <ListItemText
                        primary={e}
                        sx={
                          e.slice(0, 4).toLowerCase() === "warn"
                            ? {
                                color: "#FF1212",
                              }
                            : {}
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Grid>
          </Box>
        </Wrapper>
      ) : (
        <Wrapper>
          <Box
            sx={{
              width: "80%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.6)",
              overflowY: "scroll",
              borderRadius: "5px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              alignContent: "start",
            }}
          >
            {userCardData.length !== 0 ? (
              userCardData.map((e) => {
                if (activeStep === steps.length - 2) {
                  if (needList[e.name]) {
                    return (
                      <Card
                        key={`${e.name} + ${e.id} +${teamID}`}
                        name={e.name}
                        tag={e.category}
                        left={e.remain}
                        image={e.image}
                        limit={calcuLimit(e.limit, e.name)}
                        v={true}
                        id={e.id}
                        teamID={teamID}
                        needList={e.needList}
                        addNeedList={addNeedList}
                      />
                    );
                  }
                } else {
                  //這裡要filter

                  if (
                    (searchMethod === "Name" &&
                      e.name.toLowerCase().indexOf(searchWord.toLowerCase()) !==
                        -1) ||
                    (searchMethod === "Tag" &&
                      e.category
                        .toLowerCase()
                        .indexOf(searchWord.toLowerCase()) !== -1)
                  ) {
                    return (
                      <Card
                        key={e.name + e.id}
                        name={e.name}
                        tag={e.category}
                        left={e.remain}
                        image={e.image}
                        limit={calcuLimit(e.limit, e.name)}
                        v={true}
                        id={e.id}
                        needList={e.needList}
                        addNeedList={addNeedList}
                        rerender={rerender}
                      />
                    );
                  }
                }
              })
            ) : (
              <></>
            )}
          </Box>
        </Wrapper>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          pt: 2,
          justifyContent: "space-evenly",
        }}
      >
        <Box sx={{ maxWidth: "20%" }}>
          <Button
            disabled={activeStep === 0 || activeStep === steps.length - 1}
            onClick={handleBack}
            sx={{ m: "1px" }}
            variant={"contained"}
          >
            Back
          </Button>
        </Box>

        {activeStep === 0 ? (
          <SearchBar
            handleCheck={setSearchMethod}
            handleChange={setSearchWord}
            searchMethod={searchMethod}
          />
        ) : (
          <SearchBar
            visibility={"hidden"}
            handleCheck={setSearchMethod}
            handleChange={setSearchWord}
            searchMethod={searchMethod}
          />
        )}

        <Box sx={{ maxWidth: "25%" }}>
          {activeStep !== steps.length - 1 ? (
            <Button
              onClick={handleReset}
              variant={"contained"}
              sx={{ m: "2px" }}
            >
              Reset
            </Button>
          ) : null}

          <Button
            onClick={handleNext}
            disabled={!ableNext}
            variant={"contained"}
            sx={{ m: "2px" }}
          >
            {activeStep === steps.length - 2
              ? "Confirm"
              : activeStep === steps.length - 1
              ? "Finish"
              : "Next"}
          </Button>
          <ResetWindow
            open={resetOpen}
            handleResetClose={handleResetClose}
            handleResetAgree={reset}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Body;
