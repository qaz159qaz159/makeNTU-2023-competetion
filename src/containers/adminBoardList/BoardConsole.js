import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material/";
import { useHistory } from "react-router-dom";
import AdminCard from "../../components/adminCard";
import styled from "styled-components";
import TemplateCard from "../../components/templateCard";
import { v4 as uuidv4 } from "uuid";
import { useMakeNTU } from "../../hooks/useMakeNTU";
import { useSelector } from "react-redux";
import { selectSession } from "../../slices/sessionSlice";
/**
 * This is Main Page
 */

const Wrapper = styled.div`
  width: 100%;
  height: 65vh;
  margin: 5px 0 5px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: start;
  justify-content: center;
  // overflow-y: scroll;
`;

export default function BoardConsole({
  keyWord,
  saving,
  setAbleSave,
  setSaving,
  cards,
  setCards,
  searchMethod,
}) {
  const history = useHistory();
  const [addCardData, setAddCardData] = useState({});
  const [delCardID, setDelCardID] = useState(0);
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

  const {
    addBoard,
    deleteBoard,
    updateBoards,
    getBoards,
    addBoardData,
    getBoardData,
    updateBoardStatus,
    showAlert,
    setUpdateBoardStatus,
    subscribe,
  } = useMakeNTU();
  const { teamID, authority } = useSelector(selectSession);

  useEffect(() => {
    getBoards();
    subscribe({ id: teamID, authority: authority, page: "adminBoardList" });
  }, []);

  useEffect(() => {
    if (changedData.length === 0) return;
    updateData();
    setSaving(false);
  }, [saving]);

  useEffect(() => {
    // // // console.log("hi", changedData);
    if (changedData.length !== 0) setAbleSave(true);
    else setAbleSave(false);
    // // console.log("change", changedData);
  }, [changedData]);

  useEffect(() => {
    if (updateBoardStatus === "success") {
      setChangedData([]);
      setUpdateBoardStatus("");
      // getBoards();
      return;
    }
  }, [updateBoardStatus]);

  const updateData = () => {
    // // // console.log("updating");
    // // console.log("updating", changedData);
    updateBoards(changedData);
  };

  useEffect(() => {
    if (addCardData.name === undefined) return;
    const exist = cards.filter((card) => card.name === addCardData.name.trim());
    if (exist.length !== 0) {
      showAlert("error", `${addCardData.name.trim()} already exist!`);
      // // // console.log("existed");
      return;
    }
    // // console.log("handling", addCardData);
    const newCard = {
      ...addCardData,
      id: uuidv4(),
      remain: addCardData.totalNum,
      // image: "",
    };
    addBoard(newCard);
    setAddCardData({});
  }, [addCardData]);

  useEffect(() => {
    if (Object.keys(addBoardData).length === 0) return;
    // // console.log(addBoardData);
    setCards([addBoardData, ...cards]);
  }, [addBoardData]);

  useEffect(() => {
    setCards(getBoardData);
  }, [getBoardData]);

  useEffect(() => {
    if (cards.length === 0) return;
    // const exist = cards.filter((card) => card.id === delCardID);
    // // console.log(delCardID);
    deleteBoard(delCardID); // talk to server
    const remainCards = cards.filter((card) => card.id !== delCardID);

    setChangedData(changedData.filter((card) => card.id !== delCardID));
    // // // console.log("deleting", exist);
    setCards(remainCards);
  }, [delCardID]);

  const classes = useStyles();
  const { isLogin } = useSelector(selectSession);
  return (
    <Wrapper>
      <Box
        sx={{
          width: "80%",
          height: "100%",
          backgroundColor: "rgba(255,255,255,0.6)",
          overflowY: "scroll",
          overflowX: "hidden",
          borderRadius: "5px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {<TemplateCard setAddCardData={setAddCardData} />}
        {cards
          .filter((card) => {
            return (
              (searchMethod === "Name" &&
                card.name.toLowerCase().indexOf(keyWord.toLowerCase()) !==
                  -1) ||
              (searchMethod === "Tag" &&
                card.category.toLowerCase().indexOf(keyWord.toLowerCase()) !==
                  -1)
            );
          })
          .map((card) => {
            return (
              <AdminCard
                key={card?.name + card?.id}
                data={card}
                handleDeleteCard={setDelCardID}
                changedData={changedData}
                setChangedData={setChangedData}
              ></AdminCard>
            );
          })}
      </Box>
    </Wrapper>
  );
}
