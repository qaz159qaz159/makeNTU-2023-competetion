import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { useSelector } from "react-redux";

import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Typography,
  Snackbar,
} from "@mui/material/";

import Papa from "papaparse";
import { selectSession } from "../../slices/sessionSlice";

import TeamTable from "./TeamTable";

import { TeamDataAPI, PasswordAPI } from "../../api";
import { useMakeNTU } from "../../hooks/useMakeNTU";

const characters =
  "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789"; // no O, o, 0
const charactersLength = characters.length;
const passwordLength = 8;

const genPassword = () => {
  let result = "";
  for (let i = 0; i < passwordLength; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const authorityData = ["0", "1"];

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

/**
 * This is Team Data Page
 */
export default function TeamData() {
  const classes = useStyles();

  const [data, setData] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [filename, setFilename] = React.useState("");
  const [uploaded, setUploaded] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addMultipleOpen, setAddMultipleOpen] = React.useState(false);
  const [csv, setCsv] = React.useState("");
  const [editId, setEditId] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteIds, setDeleteIds] = React.useState([]);
  const [invalidDelete, setInvalidDelete] = React.useState(false);
  const [regenerateOpen, setRegenerateOpen] = React.useState(false);
  const [downloadOpen, setDownloadOpen] = React.useState(false);
  const [invalidRegenerate, setInvalidRegenerate] = React.useState(false);
  const [alert, setAlert] = React.useState({});
  const [errors, setErrors] = React.useState({
    id: false,
    teamName: false,
    authority: false,
  });
  const [errorsMsg, setErrorsMsg] = React.useState({
    id: "",
    teamName: "",
    authority: "",
  });
  const [newTeamMultiple, setNewTeamMultiple] = React.useState({
    id: "",
    teamName: "",
    authority: "",
  });
  const [newTeam, setNewTeam] = React.useState({
    id: "",
    teamName: "",
    authority: "",
  });
  const { teamID, authority } = useSelector(selectSession);
  const { subscribe } = useMakeNTU();
  useEffect(() => {
    subscribe({ id: teamID, authority: authority, page: "teamData" });
  }, []);
  const showAlert = (severity, msg) => {
    setAlert({ open: true, severity, msg });
  };

  const handleTeamDataReload = async () => {
    try {
      setData((await TeamDataAPI.getTeamData()).data);
    } catch (err) {
      showAlert("error", "Failed to load team data.");
    }
  };

  useEffect(() => {
    handleTeamDataReload();
  }, []);

  const handleOpenAddMultiple = () => {
    // // console.log("handleOpenAddMultiple");
    setUploaded(false);
    setAddMultipleOpen(true);
    setNewTeamMultiple({
      id: "",
      teamName: "",
      authority: "",
    });
    setLoaded(false);
    setFilename("");
  };

  const handleCloseAddMultiple = () => {
    // // console.log("handleCloseAddMultiple");
    setAddMultipleOpen(false);
  };

  const handleOpenAdd = () => {
    // // console.log(data);
    // // console.log("handleOpenAdd");
    setNewTeam({
      id: "",
      teamName: "",
      authority: "",
    });
    setErrors({
      id: false,
      teamName: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      teamName: "",
      authority: "",
    });
    setAddOpen(true);
  };

  const handleCloseAdd = () => {
    // // console.log("handleCloseAdd");
    setNewTeam({
      id: "",
      teamName: "",
      authority: "",
    });
    setErrors({
      id: false,
      teamName: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      teamName: "",
      authority: "",
    });
    setAddOpen(false);
  };

  const handleOpenEdit = (id) => {
    // // console.log("handleOpenEdit");
    setEditId(id);
    // // console.log(id);
    const team = data.find((e) => e.id === id);
    setNewTeam({
      id: team.id,
      teamName: team.teamName,
      authority: String(team.authority),
    });
    setErrors({
      id: false,
      teamName: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      teamName: "",
      authority: "",
    });
    setAddOpen(true);
  };

  const handleCloseEdit = () => {
    // // console.log("handleCloseEdit");
    setEditId("");
    setNewTeam({
      id: "",
      teamName: "",
      authority: "",
    });
    setErrors({
      id: false,
      teamName: false,
      authority: false,
    });
    setErrorsMsg({
      id: "",
      teamName: "",
      authority: "",
    });
    setAddOpen(false);
  };

  const handleOpenDelete = (ids) => {
    if (
      data.filter((e) => ids.includes(e.id)).filter((e) => e.authority === 1)
        .length !== 0
    ) {
      setInvalidDelete(true);
    } else {
      setInvalidDelete(false);
      setDeleteIds(ids);
    }
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };

  const handleOpenRegenerate = () => {
    if (
      data
        .filter((e) => selected.includes(e.id))
        .filter((e) => e.authority === 1).length !== 0
    ) {
      setInvalidRegenerate(true);
    } else {
      setInvalidRegenerate(false);
    }
    setRegenerateOpen(true);
  };

  const handleCloseRegenerate = () => {
    setRegenerateOpen(false);
  };

  const handleOpenDownload = () => {
    setDownloadOpen(true);
  };

  const handleCloseDownload = () => {
    setDownloadOpen(false);
  };

  const onIdChange = (e) => {
    setNewTeam({
      ...newTeam,
      id: e.target.value,
    });
  };

  const onNameChange = (e) => {
    setNewTeam({
      ...newTeam,
      teamName: e.target.value,
    });
  };

  const onAuthorityChange = (e) => {
    setNewTeam({
      ...newTeam,
      authority: e.target.value,
    });
  };

  const testRepeatId = (id) => {
    return data.map((e) => e.id.toUpperCase()).includes(id.toUpperCase());
  };

  const handleUploadCsv = async (efile) => {
    // // console.log(efile);
    if (efile) {
      Papa.parse(efile, {
        skipEmptyLines: true,
        complete(results) {
          let valid = true;
          let repeat = false;
          results.data.slice(1).forEach((team) => {
            if (
              // !/^(b|r|d)\d{8}$/i.test(team[0]) ||
              !team[1]
            ) {
              valid = false;
              // // console.log(team);
            }
            if (testRepeatId(team[0])) {
              repeat = true;
              // // console.log(team);
            }
          });
          if (valid && !repeat) {
            const newData = results.data.slice(1).reduce((obj, cur) => {
              return obj.concat([
                {
                  id: cur[0].toUpperCase(),
                  teamName: cur[1],
                  authority: 0,
                },
              ]);
            }, []);
            setNewTeamMultiple(newData);
            setLoaded(true);
            // // console.log("Multiple team data loaded");
            // // console.log(newData);
            setFilename(efile.name);
            return;
          }
          if (!valid && !repeat) {
            showAlert("error", "Invalid team data format.");
          }
          if (valid && repeat) {
            showAlert("error", "Team UserId repeat.");
          }
          if (!valid && repeat) {
            showAlert(
              "error",
              "Invalid team data format & Team UserId repeat."
            );
          }
          setNewTeamMultiple({
            id: "",
            teamName: "",
            authority: "",
          });
          setLoaded(false);
          setFilename("");
        },
      });
    }
  };

  const handleAddMultipleTeams = async () => {
    // // console.log("handleAddMultipleTeams");
    if (loaded) {
      const newData = newTeamMultiple.map((team) => {
        const password = genPassword();
        return { ...team, password };
      });
      // // console.log(newData);
      // // console.log("start post datas");
      try {
        await TeamDataAPI.postTeamData(
          newData.map((team) => {
            return {
              teamID: team.id,
              password: team.password,
              teamName: team.teamName,
              authority: Number(team.authority),
            };
          })
        );
        // // console.log("finish post");
        setUploaded(true);
        setData(data.concat(newData));
        // // console.log(newData);
        // // console.log(data);

        setNewTeamMultiple({
          id: "",
          teamName: "",
          authority: "",
        });

        setLoaded(false);
        const csvData = [];
        newData.forEach((e) => {
          csvData.push({
            teamID: e.id,
            teamName: e.teamName,
            password: e.password,
          });
        });
        setCsv(Papa.unparse(csvData));
        showAlert("success", "Add multiple team data complete.");
      } catch (err) {
        showAlert("error", "Failed to Add multiple team data.");
      }
    }
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

  const handleDownloadPassword = () => {
    // // console.log("download password");
    if (
      data.filter((e) => selected.includes(e.id)).filter((e) => !e.password)
        .length === 0
    ) {
      // // console.log(data.filter((e) => selected.includes(e.id)));
      const csvData = [];
      // // console.log(data);
      data
        .slice(1)
        .filter((e) => selected.includes(e.id))
        .forEach((e) => {
          csvData.push({
            teamID: e.id,
            teamName: e.teamName,
            password: e.password,
          });
        });
      download("datas.csv", Papa.unparse(csvData));
    } else {
      handleOpenDownload();
    }
  };

  const handleDownload = () => {
    // // console.log(csv);
    download("datas.csv", csv);
  };

  const handleGeneratePassword = async () => {
    // // console.log("generate password");
    const passwords = [];
    const updateData = data.map((e) => {
      if (selected.includes(e.id)) {
        const password = genPassword();
        const team = e;
        team.password = password;
        passwords.push({
          teamID: e.id,
          new_password: password,
        });
        return team;
      }
      return e;
    });
    try {
      await PasswordAPI.putPassword(passwords);
      showAlert("success", "Generate password complete.");
      setData(updateData);
      handleCloseRegenerate();
      setSelected([]);
    } catch (err) {
      showAlert("error", "Failed to regenerate password.");
      handleCloseRegenerate();
    }
  };

  const judgeNewTeam = () => {
    // // console.log(newTeam);
    let error = false;
    let newErrors = errors;
    let newErrorsMsg = errorsMsg;
    if (!newTeam.id) {
      newErrors = { ...newErrors, id: true };
      newErrorsMsg = { ...newErrorsMsg, id: "id should not be empty" };
      error = true;
    }
    // else if (!/^(b|r|d)\d{8}$/i.test(newTeam.id)) {
    //   newErrors = { ...newErrors, id: true };
    //   newErrorsMsg = { ...newErrorsMsg, id: "id invalid format" };
    //   error = true;
    // }
    else if (editId === "" && testRepeatId(newTeam.id)) {
      newErrors = { ...newErrors, id: true };
      newErrorsMsg = { ...newErrorsMsg, id: "repeat userId" };
      error = true;
    } else {
      newErrors = { ...newErrors, id: false };
      newErrorsMsg = { ...newErrorsMsg, id: "" };
    }
    if (!newTeam.teamName) {
      newErrors = { ...newErrors, teamName: true };
      newErrorsMsg = {
        ...newErrorsMsg,
        teamName: "teamName should not be empty",
      };
      error = true;
    } else {
      newErrors = { ...newErrors, teamName: false };
      newErrorsMsg = { ...newErrorsMsg, teamName: "" };
    }
    // if (!newTeam.authority) {
    //   newErrors = { ...newErrors, authority: true };
    //   newErrorsMsg = {
    //     ...newErrorsMsg,
    //     authority: "authority should not be empty",
    //   };
    //   error = true;
    // } else
    if (!/^[012]$/.test(newTeam.authority)) {
      newErrors = { ...newErrors, authority: true };
      newErrorsMsg = {
        ...newErrorsMsg,
        authority: "authority should be a 0, 1",
      };
      error = true;
    } else {
      newErrors = { ...newErrors, authority: false };
      newErrorsMsg = { ...newErrorsMsg, authority: "" };
    }
    setErrors(newErrors);
    setErrorsMsg(newErrorsMsg);
    return error;
  };

  const handleAddTeam = async () => {
    const error = judgeNewTeam();

    if (!error) {
      const password = genPassword();
      try {
        await TeamDataAPI.postTeamData([
          {
            teamID: newTeam.id,
            password,
            teamName: newTeam.teamName,
            authority: Number(newTeam.authority),
            myCards: {},
          },
        ]);
        setData(
          data.concat({
            ...newTeam,
            id: newTeam.id.toUpperCase(),
            password,
            authority: Number(newTeam.authority),
          })
        );
        setNewTeam({
          id: "",
          teamName: "",
          authority: "",
        });
        handleCloseAdd();
        showAlert("success", "Add team data success.");
      } catch {
        handleCloseAdd();
        showAlert("error", "Failed to Add team data.");
      }
    }
  };

  const handleEditTeam = async () => {
    const error = judgeNewTeam();
    if (!error) {
      try {
        await TeamDataAPI.putTeamData([
          {
            teamID: newTeam.id,
            teamName: newTeam.teamName,
            authority: Number(newTeam.authority),
          },
        ]);
        setData(
          data.map((e) => {
            if (e.id === newTeam.id) {
              return {
                id: newTeam.id,
                teamName: newTeam.teamName,
                authority: Number(newTeam.authority),
              };
            }
            return e;
          })
        );
        setNewTeam({
          id: "",
          teamName: "",
          authority: "",
        });
        handleCloseEdit();
        showAlert("success", "Edit team data success.");
      } catch (err) {
        handleCloseEdit();
        showAlert("error", "Failed to Edit team data.");
      }
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await TeamDataAPI.deleteTeamData(deleteIds);
      setData(data.filter((team) => !deleteIds.includes(team.id)));
      // // console.log("delete team data finish : ");
      // // console.log(deleteIds);
      setDeleteIds([]);
      setSelected([]);
      handleCloseDelete();
      showAlert("success", "delete team data success.");
    } catch (err) {
      showAlert("error", "Failed to delete team data.");
      handleCloseDelete();
    }
  };

  return (
    <Container className={classes.root}>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={addOpen}
        onClose={handleCloseAdd}
      >
        {editId === "" ? (
          <DialogTitle id="simple-dialog-title">Add Single Team</DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">Edit Single Team</DialogTitle>
        )}
        <DialogContent sx={{ overflow: "hidden" }}>
          <TextField
            id="teamID"
            label="teamID"
            type="text"
            fullWidth
            value={newTeam.id}
            error={errors.id}
            onChange={onIdChange}
            helperText={errorsMsg.id}
            disabled={editId !== ""}
            sx={{ margin: "5px" }}
          />
          <TextField
            id="teamName"
            label="teamName"
            type="text"
            fullWidth
            value={newTeam.teamName}
            error={errors.teamName}
            onChange={onNameChange}
            helperText={errorsMsg.teamName}
            sx={{ margin: "5px" }}
          />

          <FormControl fullWidth>
            <InputLabel>authority</InputLabel>
            <Select
              fullWidth
              value={newTeam.authority}
              error={errors.authority}
              onChange={onAuthorityChange}
              sx={{ margin: "5px" }}
            >
              {authorityData.map((e) => (
                <MenuItem key={e} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={editId === "" ? handleCloseAdd : handleCloseEdit}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={editId === "" ? handleAddTeam : handleEditTeam}
            variant="contained"
            color="primary"
          >
            {editId === "" ? "Add" : "Edit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={deleteOpen}
        onClose={handleCloseDelete}
      >
        {invalidDelete ? (
          <DialogTitle id="simple-dialog-title">
            Teams with authority 1 are invalid to delete
          </DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Are you sure to delete {deleteIds.length} teams?
          </DialogTitle>
        )}
        <DialogContent>
          {invalidDelete
            ? data
                .filter((e) => selected.includes(e.id))
                .filter((e) => e.authority === 1)
                .map((e) => (
                  <Typography key={e.id}>
                    {`id: ${e.id}, 
              teamName: ${e.teamName},
              authority: ${e.authority}`}
                  </Typography>
                ))
            : data
                .filter((e) => deleteIds.includes(e.id))
                .map((e) => e.id)
                .map((id) => (
                  <Typography key={id}>
                    {`id: ${data.find((e) => e.id === id).id}, 
              teamName: ${data.find((e) => e.id === id).teamName},
              authority: ${data.find((e) => e.id === id).authority}`}
                  </Typography>
                ))}
        </DialogContent>
        <DialogActions>
          {invalidDelete ? (
            <Button onClick={handleCloseDelete}>Done</Button>
          ) : (
            <>
              <Button onClick={handleCloseDelete} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleDeleteTeam}
                variant="contained"
                color="primary"
              >
                Delete
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={addMultipleOpen}
        onClose={handleCloseAddMultiple}
      >
        {uploaded ? (
          <DialogTitle id="simple-dialog-title">Upload Completed</DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Add multiple teams from csv file
          </DialogTitle>
        )}
        <DialogContent>
          {uploaded ? (
            <Button
              variant="contained"
              color="primary"
              component="span"
              onClick={handleDownload}
            >
              Download password
            </Button>
          ) : (
            <label htmlFor="contained-button-file">
              <input
                accept=".csv"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={(e) => handleUploadCsv(e.target.files[0])}
              />
              <Button variant="contained" color="primary" component="span">
                Select csv file
              </Button>
            </label>
          )}
          {loaded && !uploaded ? filename : ""}
        </DialogContent>
        <DialogActions>
          {uploaded ? (
            <Button
              onClick={handleCloseAddMultiple}
              variant="contained"
              color="primary"
            >
              Finish
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseAddMultiple} color="secondary">
                Cancel
              </Button>
              {loaded ? (
                <Button
                  onClick={handleAddMultipleTeams}
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
        disableBackdropClick
        open={regenerateOpen}
        onClose={handleCloseRegenerate}
      >
        {invalidRegenerate ? (
          <DialogTitle id="simple-dialog-title">
            These team are invalid to regenerate password:
          </DialogTitle>
        ) : (
          <DialogTitle id="simple-dialog-title">
            Are you sure to Regenerate password of {selected.length} teams?
          </DialogTitle>
        )}
        <DialogContent>
          {invalidRegenerate
            ? data
                .filter((e) => selected.includes(e.id))
                .filter((e) => e.authority === 1)
                .map((e) => (
                  <Typography key={e.id}>
                    {`id: ${e.id}, 
              teamName: ${e.teamName},
              authority: ${e.authority}`}
                  </Typography>
                ))
            : data
                .filter((e) => selected.includes(e.id))
                .map((e) => e.id)
                .map((id) => (
                  <Typography key={id}>
                    {`id: ${data.find((e) => e.id === id).id}, 
              teamName: ${data.find((e) => e.id === id).teamName},
              authority: ${data.find((e) => e.id === id).authority}`}
                  </Typography>
                ))}
        </DialogContent>
        <DialogActions>
          {invalidRegenerate ? (
            <Button
              onClick={handleCloseRegenerate}
              variant="contained"
              color="primary"
            >
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseRegenerate} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleGeneratePassword}
                variant="contained"
                color="primary"
              >
                Regenerate
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        aria-labelledby="simple-dialog-title"
        disableBackdropClick
        open={downloadOpen}
        onClose={handleCloseDownload}
      >
        <DialogTitle id="simple-dialog-title">
          These team are invalid to download password
        </DialogTitle>
        <DialogContent>
          {data
            .filter((e) => selected.includes(e.id))
            .filter((e) => !e.password)
            .map((e) => (
              <Typography key={e.id}>
                {`id: ${e.id}, 
              teamName: ${e.teamName},
              authority: ${e.authority}`}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDownload}
            variant="contained"
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Grid
        container
        spacing={1}
        justify="center"
        alignItems="flex-start"
        direction="row"
      >
        <Grid item sm={12}>
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
                onClick={handleOpenAdd}
                disabled={authority !== 1}
              >
                Add Single Team
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddMultiple}
                disabled={authority !== 1}
              >
                Add Teams (csv)
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDownloadPassword}
                disabled={selected.length === 0 || authority !== 1}
              >
                Download Password
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenRegenerate}
                disabled={selected.length === 0 || authority !== 1}
              >
                Generate Password
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item sm={12}>
          <TeamTable
            data={data}
            handleEdit={handleOpenEdit}
            handleDelete={handleOpenDelete}
            selected={selected}
            setSelected={setSelected}
            showAlert={showAlert}
            authority={authority}
          />
        </Grid>
        {/* <Hidden smDown>
          <Grid item md={3} />
        </Hidden> */}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert?.open}
        autoHideDuration={5000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert variant="filled" severity={alert?.severity}>
          {alert?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
