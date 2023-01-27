import React from "react";
import { useSelector } from "react-redux";
import { Element } from "react-scroll";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material/";
import { Link, useHistory } from "react-router-dom";
import { selectSession } from "../../slices/sessionSlice";
import makentuImg from "../../assets/images/makeNTU.png";
import makeNTU_big from "../../assets/images/makeNTU_big.png";

/**
 * This is Main Page
 */
export default function Top(props) {
  const history = useHistory();
  const { teamID, authority } = props;
  const useStyles = makeStyles(() => ({
    root: {
      flexGrow: 1,
      width: "100%",
      height: `calc(80vh - 64px)`,
      overflow: "auto",
    },
    paper: {
      // background: "rgb(0,0,0,.0)",
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
            // marginLeft: "30%",
            width: "90%",
            maxWidth: "1000px",
            maxHeight: "500px",
          }}
        >
          {/* <Paper className={classes.paper}> */}
          <Grid item style={{ marginTop: "min(12.5%,20px)", marginLeft: "5%" }}>
            <Typography
              gutterBottom
              variant="h5"
              className={classes.text}
              style={{ opacity: ".5", textDecoration: "none" }}
            >
              MakeNTU
            </Typography>
            <Typography
              variant="h4"
              className={classes.text}
              style={{ marginBottom: "18px" }}
            >
              Competition Web
            </Typography>
            {isLogin && (
              <Typography
                variant="h4"
                className={classes.text}
                style={{ marginBottom: "18px" }}
              >
                {authority === 0
                  ? `Welcome Back Group#${teamID}`
                  : `Welcome Back Administrator!`}
              </Typography>
            )}
          </Grid>
          {/*<Grid item xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>*/}
          {/*  <img src={makentuImg} alt="makeNTU" style={{ width: "70%", borderRadius: "50%" }} />*/}
          {/*</Grid>*/}
          {!isLogin && (
            <Grid item xs={12}>
              <Button
                style={{
                  width: "60%",
                  height: "30%",
                  display: "flex",
                  margin: "auto",
                  marginTop: "10%",
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
                onClick={() =>
                  history.push(
                    `/${authority ? "adminlasercutter" : "lasercutter"}`
                  )
                }
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
          {/*<Grid item xs={12} style={{ width: "100%", display: "flex", justifyContent: "center" }}>*/}
          {/*  <img src={makentuImg} style={{ borderRadius: "50%" }} />*/}
          {/*</Grid>*/}
        </Grid>
        {/*</Paper>*/}
      </div>
    </Element>
  );
}
