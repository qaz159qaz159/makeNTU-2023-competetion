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
            // boxShadow: "0 0 15px #f3d42e inset",
            padding: "10px",
            margin: "auto",
            marginTop: "5%",
            marginLeft: "30%",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "500px",
          }}
        >
          <Paper className={classes.paper}>
            <Grid item style={{ marginTop: "15%", marginLeft: "5%" }}>
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
              <Button
                style={{
                  width: "70%",
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
            )}
            {/* <Button
              style={{
                width: "70%",
                display: "flex",
                margin: "auto",
              }}
              variant="contained"
              color="primary"
            >
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/courses"
              >
                Start to Select Courses
              </Link>
            </Button> */}
          </Paper>
        </Grid>
      </div>
    </Element>
  );
}
