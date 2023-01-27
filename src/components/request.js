import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Paper, Grid } from "@mui/material";

export default function ComplexGrid({ data, changedData, setChangedData }) {
  const [values, setValues] = useState({});
  useEffect(() => {
    setValues({ limit: data.limit, totalNum: data.totalNum });
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });

    const existing = changedData.filter((item) => item.id === data.id);
    if (existing.length > 0) {
      setChangedData(
        changedData.map((item) => {
          if (item.id !== data.id) return item;
          return { ...data, [event.target.name]: event.target.value };
        })
      );
    } else {
      setChangedData([
        ...changedData,
        { ...data, [event.target.name]: event.target.value },
      ]);
    }
  };
  return (
    <Paper
      sx={{
        p: 2,
        margin: "5px",
        width: "100%",
        height: "auto",
        flexGrow: 1,
        position: "relative",

        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid
        container
        fullwidth="true"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>name</Grid>
        <Grid item>status</Grid>
        <Grid item>icon</Grid>
      </Grid>
    </Paper>
  );
}
