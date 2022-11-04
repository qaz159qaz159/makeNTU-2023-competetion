import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Avatar,
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material/";
import LockTwoTone from "@mui/icons-material/LockTwoTone";
import { makeStyles } from "@mui/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// api
import { SessionAPI } from "../../api";
import { setLogin } from "../../slices/sessionSlice";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      NTUEE {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "5%",
  },
  avatar: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(8),
    backgroundColor: theme.palette.secondary.main,
    height: "70px",
    width: "70px",
  },
  form: {
    width: "80%",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(8),
  },
  submit: {
    margin: theme.spacing(5, 0, 2),
  },
  accountmargin: {
    marginBottom: theme.spacing(2),
  },
}));

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [values, setValues] = React.useState({
    account: "",
    password: "",
    showPassword: false,
    error: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      // /^(b|r|d)\d{8}$/i.test(values.account) &&
      !/^$/i.test(values.password)
    ) {
      values.error = false;
      try {
        const response = await SessionAPI.postSession(
          values.account,
          values.password
        );
        dispatch(setLogin(response.data));
      } catch (err) {
        console.error(err);
        values.error = true;
      }
    } else {
      values.error = true;
    }
    setValues({ ...values, account: "", password: "", showPassword: "" });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockTwoTone style={{ fontSize: 40 }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            <div>Sign in</div>
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <OutlinedInput
              error={values.error}
              margin="dense"
              required
              fullWidth
              id="StudentId"
              placeholder="Student ID"
              value={values.account}
              name="StudentId"
              className={classes.accountmargin}
              autoComplete="StudentId"
              onChange={handleChange("account")}
              autoFocus
            />
            <OutlinedInput
              error={values.error}
              margin="dense"
              required
              fullWidth
              name="password"
              placeholder="Password"
              value={values.password}
              id="password"
              type={values.showPassword ? "text" : "password"}
              autoComplete="current-password"
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <div style={{ color: "red" }}>
              {values.error ? "Incorrect account or password" : null}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="primary"
              className={classes.submit}
            >
              <div>Sign in</div>
            </Button>
            <Box>
              <Copyright />
            </Box>
          </form>
        </div>
      </Container>
    </div>
  );
}
