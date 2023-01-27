import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Box,
  Paper,
} from "@mui/material/";
import { useHistory } from "react-router-dom";
import { selectSession } from "../../slices/sessionSlice";
import GroupStatus from "./components/GroupStatus";
import { TeamDataAPI } from "../../api";
import { useMakeNTU } from "../../hooks/useMakeNTU";

/**
 * This is Main Page
 */

export default function StatusConsole() {
  const [userStatus, setUserStatus] = useState([]);
  const [changedData, setChangedData] = useState([]);
  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      width: "100%",
      height: "80vh",
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
  }));
  const { requestData, teamReqUpdateDate } = useMakeNTU();
  useEffect(async () => {
    //獲取user資料
    // console.log("fetching data...");
    const { data: userData } = await TeamDataAPI.getTeamData();
    // console.log(userData);
    setUserStatus(userData);
  }, [requestData, teamReqUpdateDate]);

  useEffect(() => {
    // console.log(changedData);
  }, [changedData]);

  const classes = useStyles();
  const { isLogin } = useSelector(selectSession);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.6)",
        overflowX: "hidden",
        borderRadius: "5px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "middle",
                maxHeight: "10vh",
              }}
            >
              <TableCell />
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "h5.fontSize",
                }}
                align="center"
              >
                TEAM STATUS
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {userStatus
              ?.filter((team) => team.authority !== 1)
              .sort((teamA, teamB) => {
                const notReturned_A = teamA?.myCards
                  ? Object.keys(teamA?.myCards).length
                  : 0;
                const notReturned_B = teamB?.myCards
                  ? Object.keys(teamB?.myCards).length
                  : 0;

                return notReturned_A - notReturned_B === 0
                  ? parseInt(teamA.id) - parseInt(teamB.id)
                  : -(notReturned_A - notReturned_B);
              })
              .map((team) => {
                return (
                  <GroupStatus
                    key={`${team?.name}+ ${team?.id}`}
                    team={team}
                  ></GroupStatus>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
