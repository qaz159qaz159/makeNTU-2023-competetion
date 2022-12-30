import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import LaserCutterCards from "./leichieCard";

const LaserCutterBox = () => (
  <Card>
    <CardContent>
      {/* Grid container for all cards */}
      <Grid
        container
        wrap="nowrap"
        spacing={2}
        direction="row"
        style={{ padding: 10, overflow: "auto" }}
      >
        {/* 有幾台雷切就放幾個components */}
        <LaserCutterCards />
        <LaserCutterCards />
        <LaserCutterCards />
        <LaserCutterCards />
      </Grid>
    </CardContent>
  </Card>
);

export default LaserCutterBox;
