import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";

import Selector from "./Selector";
import { NearMeDisabled } from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import { useMakeNTU } from "../../../hooks/useMakeNTU";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "128px",
  maxHeight: "128px",
});

export default function Card(props) {
  // // console.log(props)
  const [num, setNum] = React.useState(0);
  const { breakpoints } = useMakeNTU();
  //// console.log(props.addNeedList);
  useEffect(() => {
    if (props.needList[props.name]) {
      // console.log("needList " + num);
      setNum(props.needList[props.name]);
      if (props.needList[props.name] > props.left) {
        props.addNeedList(props.name, props.left);
      }
    }
  }, [props.needList]);

  useEffect(() => {
    // console.log("default is " + num);
  }, [num]);

  return (
    <Paper
      sx={{
        minWidth: 230,
        maxHeight: breakpoints.isXs ? 800 : 180,
        p: 2,
        margin: "5px",
        flexGrow: 3,
        visibility: !props.v ? "hidden" : "visible",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <ButtonBase sx={{ width: 128, height: 128 }}>
            <Img
              alt="img not found"
              src={props?.image || "/photoData/MakeNTU2022_icon.png"}
            />
            {/* 這裡是放照片的 */}
          </ButtonBase>
        </Grid>
        <Grid item sx={{ minWidth: 150, minHeight: 160 }} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                {props.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {"TAG: " + props.tag}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {"ID: " + props.id.slice(0, 8)}
              </Typography>
            </Grid>
            <Grid item>
              <Selector
                id={props.id}
                name={props.name}
                defaultValue={num}
                teamID={props.teamID}
                limit={Math.min(props.limit, props.left)}
                addNeedList={props.addNeedList}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div">
              left:{`${props.left}  `}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
