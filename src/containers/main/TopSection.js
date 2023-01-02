import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Paper, Typography } from "@mui/material/";
import { Link, useHistory } from "react-router-dom";
import { selectSession } from "../../slices/sessionSlice";

/**
 * This is Main Page
 */
export default function Top() {
  const history = useHistory();

  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      width: "100%",
      height: "100vh",
      overflow: "auto",
    },
    paper: {
      background: "rgb(0,0,0,.0)",
      boxShadow: "none",
      width: "100%",
      height: "100%",
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

  const classes = useStyles();
  const { isLogin } = useSelector(selectSession);
  return (
    <Element name="title">
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          style={{
            padding: "10px",
            margin: "auto",
            marginTop: "5%",
            width: "90%",
            height: "90%",
          }}
        >
          <Paper className={classes.paper}>
            <Grid container spacing={2} style={{ marginTop: "10%" }}>
              <Grid item style={{ marginTop: "5%", marginLeft: "5%" }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classes.text}
                  style={{ opacity: ".5", textDecoration: "none" }}
                >
                  MakeNTU
                </Typography>
                <Typography
                  variant="h3"
                  className={classes.text}
                  style={{ marginBottom: "18px" }}
                >
                  Competition Web
                </Typography>
              </Grid>
              {!isLogin && (
                <Grid item xs={12}>
                  <Button
                    style={{
                      width: "70%",
                      height: "30%",
                      display: "flex",
                      margin: "auto",
                      marginTop: "15%",
                      marginBottom: "3%",
                    }}
                    variant="outlined"
                    color="primary"
                    onClick={() => history.push("/login")}
                  >
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      to="/login"
                    >
                      Log in
                    </Link>
                  </Button>
                </Grid>
              )}
              {isLogin && (
                <Grid item xs={12}>
                  <Button
                    style={{
                      width: "70%",
                      // height: "30%",
                      display: "flex",
                      margin: "auto",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/3dp")}
                  >
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      to="/courses"
                    >
                      3D Printer
                    </Link>
                  </Button>
                </Grid>
              )}
              {isLogin && (
                <Grid item xs={12}>
                  <Button
                    style={{
                      width: "70%",
                      // height: "30%",
                      display: "flex",
                      margin: "auto",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/adminlasercutter")}
                  >
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      to="/courses"
                    >
                      雷切
                    </Link>
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </div>
    </Element>
  );
}
