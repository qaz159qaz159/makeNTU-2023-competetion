import * as React from "react";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GroupContent from "./GroupContent";

function BoardRequest(props) {
  //every team
  const { team, breakpoints } = props;
  const [open, setOpen] = React.useState(false);
  // // console.log(team?.myCards);
  React.useEffect(() => {
    const notReturned = team?.myCards ? Object.keys(team?.myCards).length : 0;

    if (notReturned === 0) setOpen(false);
  }, [team]);
  const notReturned = team?.myCards ? Object.keys(team?.myCards).length : 0;
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, maxHeight: "10vh" }}>
        <TableCell align="left">{team?.teamName ?? "undefined"}</TableCell>

        {notReturned === 0 ? (
          <>
            <TableCell align="center">已歸還</TableCell>
            <TableCell align="right" />
          </>
        ) : (
          <>
            <TableCell align="center">{`${notReturned} 種未歸還`}</TableCell>
            <TableCell align="right">
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow>
        <GroupContent team={team} open={open} breakpoints={breakpoints} />
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
export default BoardRequest;
