import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import TextField from "@mui/material/TextField";
import Selector from "../userProgress/Components/Selector";

import { useEffect } from "react";
import { useMakeNTU } from "../../hooks/useMakeNTU";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "auto",
});

export default function Card(props) {
  //const [num, setNum] = React.useState(0);
  const { num, userBoard } = props;
  const { breakpoints } = useMakeNTU();
  //// console.log(props.addNeedList);
  /*useEffect(() => {
    if (props.needList.has(props.id)) {
      setNum(props.needList.get(props.id));
    }
  }, []);
*/
  return (
    <Paper
      sx={{
        p: 2,
        margin: "5px",
        flexGrow: 3,
        visibility: "visible", //!props.v ? "hidden" : "visible",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase
            sx={
              breakpoints.isPhone
                ? { width: 90, height: 90 }
                : { width: 128, height: 128 }
            }
          >
            <Img
              alt="image not found"
              src={userBoard?.image || "/photoData/MakeNTU2022_icon.png"}
            />
            {/* 這裡是放照片的 */}
          </ButtonBase>
        </Grid>
        <Grid item sx={{ minWidth: 150, minHeight: 160 }} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {userBoard.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                TAG: {userBoard.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {userBoard.id.slice(0, 8)}
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                disabled
                id="outlined-disabled"
                label="Amount"
                size="small"
                value={num}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
