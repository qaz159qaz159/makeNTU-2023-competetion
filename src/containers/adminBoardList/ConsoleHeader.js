import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { makeStyles } from "@mui/styles";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
} from "@mui/material";
import { useMakeNTU } from "../../hooks/useMakeNTU";
import Papa from "papaparse";
import { useEffect } from "react";

const HeaderContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
`;
const ButtonContainer = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
`;

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: "1000px",
    padding: "0px",
    "& > *": {
      margin: "auto",
    },
  },
  input: {
    display: "none",
  },
}));
export default function Header({ setSaving, ableSave, data }) {
  const classes = useStyles();
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newBoardData, setNewBoardData] = useState([]);
  const [fileName, setFilename] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [importError, setImportError] = useState(false);
  const [csv, setCsv] = React.useState("");
  const [resetPageOpen, setResetPageOpen] = React.useState(false);
  const { dataINIT, handleReplaceBoard, showAlert, resetDataBase } =
    useMakeNTU();
  useEffect(() => {
    const csvData = data.map((item) => {
      const { id, name, category, limit, totalNum, image } = item;
      return { id, name, category, limit, totalNum, image };
    });
    setCsv(Papa.unparse(csvData));
  }, [data]);
  const handleInitData = () => {
    dataINIT();
    handleCloseImport();
  };

  const handleCloseImport = () => {
    setNewBoardData([]);
    setFilename("");
    setLoaded(false);
    setImportError(false);
    setImportOpen(false);
  };
  const handleImport = () => {
    // console.log("handleImport");
    if (loaded) {
      // console.log("uploading");
      try {
        handleReplaceBoard(newBoardData);
        setUploaded(true);
        setLoaded(false);
        setCsv(Papa.unparse(newBoardData));
      } catch (e) {
        showAlert("error", "Upload file Failed.");
        // console.log(e);
      }
    }
  };
  const handleOpenImport = () => {
    setImportOpen(true);
  };
  const testRepeatArr = (arr) => {
    return new Set(arr).size !== arr.length;
  };
  const handleUploadCsv = (efile) => {
    // // console.log(efile);
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          let valid = true;
          // console.log(results.data.slice(1));
          results.data.slice(1).forEach((board) => {
            if (!board[1] || !board[2] || !board[3] || !board[4]) {
              valid = false;
            }
          });
          const IDArr = results.data.slice(1).map((e) => e[0]);
          const NameArr = results.data.slice(1).map((e) => e[1]);
          let repeatID = testRepeatArr(IDArr);
          let repeatName = testRepeatArr(NameArr);
          let repeat = repeatID || repeatName;
          if (valid && !repeat) {
            const newData = results.data.slice(1).reduce((obj, cur) => {
              return obj.concat([
                {
                  id: cur[0].toUpperCase(),
                  name: cur[1],
                  category: cur[2],
                  limit: cur[3],
                  totalNum: cur[4],
                  remain: cur[4],
                  image: cur[5] ?? "",
                },
              ]);
            }, []);
            // console.log(newData);
            setNewBoardData(newData);
            setImportError(false);
            setLoaded(true);
            setFilename(efile.name);
            showAlert("success", "File Loaded.", 2000);
            return;
          }
          if (!valid && !repeat) {
            showAlert("error", "Invalid data format.", 3000);
            setImportError(true);
          }
          if (valid && repeat) {
            showAlert(
              "error",
              `Team ${
                repeatID && repeatName ? "ID&Name" : repeatName ? "Name" : "ID"
              } repeat.`,
              3000
            );
            setImportError(true);
          }
          if (!valid && repeat) {
            showAlert(
              "error",
              `Invalid data format & Team ${
                repeatID && repeatName ? "ID&Name" : repeatName ? "Name" : "ID"
              } repeat..`,
              3000
            );
            setImportError(true);
          }
          // console.log("file");
          setNewBoardData([]);
          setLoaded(false);
          setFilename("");
        },
      });
    }
  };
  const handleCloseExport = () => {
    setExportOpen(false);
  };
  const download = (filename, text) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    );
    element.setAttribute("download", filename);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };
  const handleExport = () => {
    download(`boards_${new Date().getTime()}.csv`, csv);
    handleCloseExport();
  };
  const handleOpenExport = () => {
    setExportOpen(true);
  };

  const handleSave = () => {
    setSaving(true);
  };
  const handleReset = () => {
    resetDataBase();
    handleCloseReset();
  };
  const handleCloseReset = () => {
    setResetPageOpen(false);
  };
  const handleOpenReset = () => {
    setResetPageOpen(true);
  };
  return (
    <HeaderContainer>
      <ButtonContainer>
        <Dialog
          aria-labelledby="simple-dialog-title"
          // disableBackdropClick
          open={importOpen}
          onClose={handleCloseImport}
          // sx={{ backgroundColor: "rgba(0,0,0,1)" }}
        >
          <DialogTitle id="simple-dialog-title">Importing Data</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: "15vw", minHeight: "10vh" }}>
              <label htmlFor="contained-button-file">
                <input
                  accept=".csv"
                  className={classes.input}
                  id="contained-button-file"
                  type="file"
                  onChange={(e) => handleUploadCsv(e.target.files[0])}
                />
                <Button
                  variant="contained"
                  color={importError ? "error" : "primary"}
                  component="span"
                >
                  Import csv file
                </Button>
              </label>
              {loaded && !uploaded ? fileName : ""}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImport} color="secondary">
              Cancel
            </Button>

            {uploaded ? (
              <Button
                onClick={handleCloseImport}
                variant="contained"
                color="primary"
              >
                Finish
              </Button>
            ) : (
              <>
                {/* <Button
                  onClick={handleInitData}
                  variant="contained"
                  color="primary"
                  sx={{ m: "5px" }}
                >
                  {"Init"}
                </Button> */}
                {loaded ? (
                  <Button
                    onClick={handleImport}
                    variant="contained"
                    color="primary"
                  >
                    Upload
                  </Button>
                ) : (
                  <> </>
                )}
              </>
            )}
          </DialogActions>
        </Dialog>
        <Dialog
          aria-labelledby="simple-dialog-title"
          // disableBackdropClick
          open={exportOpen}
          onClose={handleCloseExport}
          // sx={{ backgroundColor: "rgba(0,0,0,1)" }}
        >
          <DialogTitle id="simple-dialog-title">Exporting Data</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: "15vw", minHeight: "10vh" }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseExport} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleExport} variant="contained" color="primary">
              {"Export"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          aria-labelledby="simple-dialog-title"
          // disableBackdropClick
          open={resetPageOpen}
          onClose={handleCloseReset}
          // sx={{ backgroundColor: "rgba(0,0,0,1)" }}
        >
          <DialogTitle id="simple-dialog-title">Exporting Data</DialogTitle>
          <DialogContent>
            <Box sx={{ minWidth: "15vw", minHeight: "10vh" }}>
              {"Are you sure you want to RESET!? :("}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReset} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleReset} variant="contained" color="primary">
              {"Reset"}
            </Button>
          </DialogActions>
        </Dialog>
        <Grid
          container
          spacing={1}
          // justify="center"
          justifyContent="space-between"
          alignItems="flex-start"
          direction="row"
        >
          <Grid item sm={5}>
            <Grid
              container
              spacing={1}
              justify="flex-start"
              alignItems="flex-start"
              direction="row"
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenImport}
                >
                  Import
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenExport}
                >
                  Export
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={5}>
            <Grid
              container
              spacing={1}
              justifyContent="flex-end"
              alignItems="flex-start"
              direction="row"
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenReset}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={!ableSave}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ButtonContainer>
    </HeaderContainer>
  );
}
