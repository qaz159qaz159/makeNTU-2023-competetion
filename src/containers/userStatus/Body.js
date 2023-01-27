import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import styled from "styled-components";
import Row from "./UserRow";
import Card from "./Cards";
import { useMakeNTU } from "../../hooks/useMakeNTU";
import { useSelector, useDispatch } from "react-redux";
import { selectSession } from "../../slices/sessionSlice";
import { useEffect, useState } from "react";

const Wrapper = styled.div`
  width: 100%;
  height: 80vh;
  margin: 5px 0 5px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;
  //min-width: 380px;
  // overflow-y: hidden;
`;
function Body() {
  const {
    userRequest,
    getUser,
    userCards,
    subscribe,
    getBoardData,
    render,
    setRender,
    breakpoints,
  } = useMakeNTU();
  const { teamID, authority } = useSelector(selectSession);
  const [userBoard, setUserBoard] = useState([]);
  const [myRequest, setMyRequest] = useState([]);

  useEffect(() => {
    getUser(teamID);
    subscribe({ id: teamID, authority: authority, page: "userStatus" });
  }, []);
  useEffect(() => {
    if (!render) return;
    setMyRequest(JSON.parse(JSON.stringify(userRequest)));
    setUserBoard([]);
    let ub = JSON.parse(JSON.stringify(getBoardData));
    //// console.log(userCards);
    ub = ub
      .filter((ubb) => ubb.name in userCards)
      .map((item) => {
        item.num = userCards[item.name];
        return item;
      });
    setUserBoard(ub);
    setRender(false);
  }, [render]);

  return (
    <Wrapper>
      <Box
        sx={{
          width: "80%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.6)",
          overflowY: "hidden",
          borderRadius: "5px",
          flexWrap: "wrap",
          // justifyContent: "space-around",
          justifyContent: "flex-start",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            //margin: "5px",
            width:
              breakpoints.isXs || breakpoints.isSm
                ? "100%"
                : breakpoints.isPhone
                ? "47%"
                : "35%",
            height: "100%",
            backgroundColor: "rgba(38,43,50)",
            overflowY: "auto",
            overflowX: "hidden",
            borderRadius: "5px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              overflowX: "hidden",
            }}
          >
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    alignItems: "middle",
                    maxHeight: "10vh",
                  }}
                >
                  {/* <TableCell /> */}
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: "h4.fontSize",
                    }}
                    align="center"
                    colSpan={3}
                  >
                    My Requests
                  </TableCell>

                  {/* <TableCell /> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {breakpoints.isXs || breakpoints.isSm ? (
                  <Row
                    key={"userBoard" + teamID}
                    row={userBoard}
                    teamID={teamID}
                    state={true}
                  />
                ) : (
                  ""
                )}
                {myRequest.map((row) => (
                  <Row key={row._id} row={row} teamID={teamID} state={false} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {
          //for cards
        }

        <Box
          sx={{
            //margin: "5px",
            width: breakpoints.isPhone ? "53%" : "65%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.6)",
            overflowY: "auto",
            overflowX: "hidden",
            borderRadius: "5px",
            display: "flex", //breakpoints.isXs || breakpoints.isSm ? "none" : "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "start",
          }}
        >
          {userBoard
            ? userBoard.map((element) => {
                return (
                  <Card
                    key={element.id + teamID}
                    num={element.num}
                    userBoard={element}
                  />
                );
              })
            : ""}
        </Box>
      </Box>
    </Wrapper>
  );
}

export default Body;
