import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import GroupContentElement from "./GroupContentElement";
import { useMakeNTU } from "../../../hooks/useMakeNTU";
function GroupContent(props) {
  const { team, open, breakpoints } = props;
  const [numReturn, setNumReturn] = React.useState({});
  const [boards, setBoards] = React.useState([]);
  const { updateReturn, showAlert } = useMakeNTU();
  const handleEdit = () => {
    // console.log(team, numReturn);
    for (const [key, value] of Object.entries(numReturn)) {
      if (isNaN(value)) {
        showAlert("error", "Please Enter Number!");
        return;
      }
    }
    updateReturn({ id: team.id, returned: numReturn });
  };

  React.useEffect(() => {
    // let newBoards = [];
    if (!team?.myCards) return;
    if (Object.keys(team.myCards).length === 0) return;
    // // console.log(Object.keys(team.myCards));
    let newReturn;
    let newBoards = Object.keys(team.myCards).map((key) => {
      newReturn = { ...newReturn, [key]: 0 };
      return {
        board: key,
        quantity: team.myCards[key],
      };
    });
    setNumReturn(newReturn);
    // // console.log("team", newBoards);
    setBoards(newBoards);
  }, [team]);

  const changeReturn = (name, num, valid) => {
    let a = JSON.parse(JSON.stringify(numReturn));
    if (!valid) return;
    setNumReturn({ ...a, [name]: num });
  };
  return (
    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
      <Collapse in={open}>
        <Table size="small" sx={{ m: 1 }}>
          <TableHead>
            <TableRow>
              <TableCell>Boards</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Returned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <React.Fragment>
              {boards.map((card, index) => (
                <GroupContentElement
                  key={`${card}+${index}`}
                  changeReturn={changeReturn}
                  card={card}
                  numReturn={numReturn}
                  index={index}
                  breakpoints={breakpoints}
                />
              ))}
            </React.Fragment>
          </TableBody>
        </Table>

        <Box sx={{ margin: 1, display: "flex", flexDirection: "row-reverse" }}>
          <Chip
            label="Edit"
            variant="outlined"
            onClick={handleEdit}
            sx={{ fontSize: 17 }}
          />
        </Box>
      </Collapse>
    </TableCell>
  );
}

export default GroupContent;
