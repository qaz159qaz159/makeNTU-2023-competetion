import * as React from "react";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroupStatusContent from "./RequestStatusContent";
import { useMakeNTU } from "../../../hooks/useMakeNTU";
function RequestStatus(props) {
  //every request
  const { data, breakpoints } = props;
  // // console.log(data);
  const [open, setOpen] = React.useState(false);
  const [timer, setTimer] = React.useState(0);
  const [intervalId, setIntervalID] = React.useState(0);
  const { getRequest } = useMakeNTU();
  // // console.log(breakpoints);
  React.useEffect(() => {
    const d = new Date().getTime(); //number
    const pretime = 15 * 60 - Math.floor(d - data?.sendingTime) / 1000;
    setTimer(pretime);
    if (data?.status === "pending" || data?.status === "ready") {
      let Id = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      setIntervalID(Id);
      return () => clearInterval(Id);
    } else {
      setTimer(0);
    }
  }, []);

  React.useEffect(() => {
    if (timer < 0) {
      clearInterval(intervalId);
      getRequest();
    }
  }, [timer]);

  const showTime = () => {
    if (
      data?.status === "denied" ||
      data?.status === "cancel" ||
      data?.status === "expired"
    ) {
      return "00 : 00";
    }
    if (timer <= 0) return "00 : 00";
    const sec =
      (timer % 60) / 10 < 1
        ? "0" + Math.floor(timer % 60)
        : Math.floor(timer % 60);
    const min =
      timer / 60 / 10 < 1
        ? "0" + Math.floor(timer / 60)
        : Math.floor(timer / 60);
    return `${min} : ${sec}`;
  };
  const statusTEXT = {
    pending: "申請中",
    solved: "已領取",
    ready: "呼叫中",
    denied: "已拒絕",
    cancel: "已取消",
    expired: "已逾期",
  };
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, maxHeight: "10vh" }}>
        <TableCell align={breakpoints.isXs ? "center" : "left"}>
          {data?.borrower?.teamName ?? "undefined"}
        </TableCell>
        {breakpoints.isXs ? (
          <></>
        ) : (
          <TableCell
            align="center"
            sx={{
              color: timer < 60 ? "#FF1212" : "white",
            }}
          >
            {showTime() ?? "undefined"}
          </TableCell>
        )}
        <TableCell align="center">
          {statusTEXT[data?.status] ?? "未知"}
        </TableCell>
        <TableCell align="right">
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
        <GroupStatusContent data={data} open={open} />
      </TableRow>
    </React.Fragment>
  );
}
/*
Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};
*/
export default RequestStatus;
