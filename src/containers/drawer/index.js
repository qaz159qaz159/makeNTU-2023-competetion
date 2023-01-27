import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
// material_ui
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer as MUIDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material/";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HomeIcon from "@mui/icons-material/Home"; // Main
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Login, Logout
import PeopleIcon from "@mui/icons-material/People"; // Team Data
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard"; //boardList
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; //租借開發版
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings"; // admin icon
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Redirect } from "react-router";
import { selectSession, logout } from "../../slices/sessionSlice";
import { useMakeNTU } from "../../hooks/useMakeNTU";

// route

const drawerWidth = 200;
const maxPhoneWidth = 700;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    position: "relative",
    zIndex: theme.zIndex.drawer - 1000,
  },
  root: {
    //  display: "flex",
  },
  appBar: {
    paddingTop: theme.spacing(1),
    color: "#fff",
    boxShadow: "none",
    // backgroundColor: "rgb(25,34,49,.7)",
    backgroundColor: "black",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    [theme.breakpoints.up("phone")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  hide: {
    display: "none",
  },
  appBarTypography: {
    flexGrow: 1,
  },
  drawerOpen: {
    [theme.breakpoints.up("phone")]: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  },
  drawerClose: {
    overflowX: "hidden",
    overflowY: "hidden",
    width: theme.spacing(0),
    [theme.breakpoints.up("phone")]: {
      width: theme.spacing(0) + 1,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  },
  menuButton: {
    marginRight: 10,
  },
  iconButton: {
    marginRight: 0,
  },
  toolbar: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
    [theme.breakpoints.up("phone")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    marginLeft: 0,
  },
  contentShift: {
    [theme.breakpoints.up("phone")]: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    },
  },
  offset: theme.mixins.toolbar,
}));

const Drawer = ({ children }) => {
  const { isLogin, authority, teamID } = useSelector(selectSession);
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { alert, setAlert } = useMakeNTU();
  const handleDrawerOpen = () => {
    setOpen(() => !open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const itemList = !isLogin
    ? [
        { text: "Main", to: "/", icon: <HomeIcon /> },
        { text: "Login", to: "/login", icon: <ExitToAppIcon /> },
      ]
    : {
        1: [
          //admin區
          { text: "Home", to: "/", icon: <HomeIcon /> },
          {
            text: "各組資料",
            to: "/teamdata",
            icon: <PeopleIcon />,
          },
          {
            text: "雷射切割機管理",
            to: "/adminlasercutter",
            icon: <AdminPanelSettingsIcon />,
          },
          {
            text: "3D列印機管理",
            to: "/3dp",
            icon: <AdminPanelSettingsIcon />,
          },
          {
            text: "Items List",
            to: "/boardlist",
            icon: <DeveloperBoardIcon />,
          },
          {
            text: "Request Status",
            to: "/requestStatus",
            icon: <FactCheckIcon />,
          },
        ],
        0: [
          //user區
          { text: "Home", to: "/", icon: <HomeIcon /> },
          {
            text: "Borrow Items",
            to: "/user",
            icon: <DeveloperBoardIcon />,
          },
          {
            text: "Your Status",
            to: "/user/status",
            icon: <FactCheckIcon />,
          },
          { text: "雷射切割機借用", to: "/lasercutter", icon: <PostAddIcon /> },
          { text: "3D列印機借用", to: "/3dp", icon: <PostAddIcon /> },
        ],
      }[authority] || [{ text: "Home", to: "/", icon: <HomeIcon /> }];

  const userName = isLogin ? teamID : "";

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        position="fixed"
        sx={{ backgroundColor: "rgb(15,15,15)" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          {/* <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={handleDrawerClose}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: !open || window.innerWidth >= maxPhoneWidth,
            })}
          >
            <KeyboardArrowUpIcon />
          </IconButton> */}
          <Typography variant="h5" className={classes.appBarTypography}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/")}
              aria-hidden="true"
            >
              MakeNTU
            </div>
          </Typography>
          <Typography
            variant="h6"
            className={clsx({
              [classes.hide]: isLogin,
            })}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => history.push("/login")}
              aria-hidden="true"
            >
              LOGIN
            </div>
          </Typography>
          <Typography variant="h6">{userName}</Typography>
          <IconButton
            className={clsx(classes.iconButton, {
              [classes.hide]: !isLogin,
            })}
            onClick={() => dispatch(logout())}
          >
            <ExitToAppIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <MUIDrawer
        anchor={window.innerWidth >= maxPhoneWidth ? "left" : "top"}
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowUpIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
        </div>

        <List>
          {itemList.map(({ text, to, icon }) => {
            return (
              <ListItem
                button
                key={text}
                component={Link}
                to={to}
                onClick={handleDrawerClose}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </MUIDrawer>
      <div className={classes.offset} />
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        {children}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alert?.open}
        autoHideDuration={alert?.duration ?? 1000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert variant="filled" severity={alert?.severity}>
          {alert?.msg}
        </Alert>
      </Snackbar>
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Drawer;
