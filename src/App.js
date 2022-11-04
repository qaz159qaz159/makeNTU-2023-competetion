import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
// Route
import { Redirect } from "react-router";
import PublicRoute from "./components/routes/publicRoute";
import PrivateRoute from "./components/routes/privateRoute";
import LoginRoute from "./components/routes/loginRoute";
import MainRoute from "./components/routes/mainRoute";
import AdminRoute from "./components/routes/adminRoute";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Login from "./containers/login";
import StudentData from "./containers/studentData";
import theme from "./theme";
// compononets
import Loading from "./components/loading";
// initialize, slices
import { init, selectSession } from "./slices/sessionSlice";

const Routes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, []);
  const { initialized } = useSelector(selectSession);
  return !initialized ? (
    <Loading />
  ) : (
    <Switch>
      <MainRoute exact path="/">
        <Main />
      </MainRoute>
      <LoginRoute exact path="/login">
        <Login />
      </LoginRoute>
      <PrivateRoute exact path="/studentdata">
        <StudentData />
      </PrivateRoute>
      <Redirect to="/login" />
    </Switch>
  );
};

export default function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <Drawer>
            <Routes />
          </Drawer>
        </Router>
      </ThemeProvider>
    </div>
  );
}
