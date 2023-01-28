import * as React from "react";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RowContent from "./UserRowContent";
import { useEffect, useState, useRef } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMakeNTU } from "../../hooks/useMakeNTU";
import { List, ListItem } from "@mui/material";
function Row(props) {
  const { row, teamID, state } = props;
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const { deleteRequestFromUser, getUser, render, breakpoints } = useMakeNTU();
  let intervalId = useRef();
  //timer
  useEffect(() => {
    if (render) return;
    if (state) return;

    var d = new Date().getTime(); //number
    var pretime = parseInt(
      15 * 60 - Math.floor((d - row.sendingTime) / 1000),
      10
    );
    setTimer(pretime);
    if (row.status === "pending" || row.status === "ready") {
      intervalId.current = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      // console.log("break!");
      return () => clearInterval(intervalId.current);
    } else {
      setTimer(0);
    }
  }, []);

  useEffect(() => {
    if (timer < 0) {
      clearInterval(intervalId.current);
      getUser(teamID);
    }
  }, [timer]);

  const showTime = () => {
    if (
      row.status === "denied" ||
      row.status === "cancel" ||
      row.status === "expired" ||
      timer <= 0 ||
      state
    ) {
      return "00 : 00";
    }
    var min = (timer % 60) / 10 < 1 ? "0" + (timer % 60) : timer % 60;
    return parseInt(timer / 60) + " : " + min;
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, maxHeight: "10vh" }}>
        {state ? (
          <TableCell
            align="left"
            sx={{ p: "6px", border: 0, minWidth: "4em", color: "#00FF00" }}
          >
            已領取
          </TableCell>
        ) : row.status === "pending" ? (
          <TableCell align="left" sx={{ p: "6px", border: 0, minWidth: "4em" }}>
            申請中
          </TableCell>
        ) : row.status === "ready" ? (
          <TableCell align="left" sx={{ border: 0, minWidth: "4em", p: "6px" }}>
            請來拿
          </TableCell>
        ) : (
          <TableCell
            align="left"
            sx={{
              color: "#FF1212",
              border: 0,
              minWidth: "5em",
              p: "6px",
            }}
          >
            {row.status === "denied" ? (
              "已拒絕"
            ) : row.status === "cancel" ? (
              "已取消"
            ) : breakpoints.isPhone ||
              breakpoints.isXs ||
              breakpoints.isSm ||
              breakpoints.isMd ? (
              "已超時..."
            ) : (
              <List sx={{ p: "0px" }}>
                <ListItem key="已超時" sx={{ p: "2px", pl: "0px" }}>
                  已超時
                </ListItem>
                <ListItem key="請重新申請" sx={{ p: "2px", pl: "0px" }}>
                  請重新申請
                </ListItem>
              </List>
            )}
          </TableCell>
        )}

        <TableCell align="center" sx={{ py: "6px", px: "0px", border: 0 }}>
          {showTime()}
        </TableCell>

        <TableCell align="right" sx={{ display: "flex", border: 0, p: "6px" }}>
          {!state && row.status !== "pending" && row.status !== "ready" ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => deleteRequestFromUser([teamID, row._id])}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            ""
          )}
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <RowContent row={row} open={open} teamID={teamID} state={state} />
      </TableRow>
    </React.Fragment>
  );
}

export default Row;
