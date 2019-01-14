import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createMuiTheme,
  createStyles,
  MuiThemeProvider,
  Theme,
  withStyles,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import FolderIcon from "@material-ui/icons/Folder";
import HomeIcon from "@material-ui/icons/Home";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";

import classNames from "classnames";
import * as React from "react";
import { Link, Route, Switch } from "react-router-dom";

import Calendar from "./pages/Calendar";
import Content from "./pages/Content";
import EditContent from "./pages/EditContent";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import palette from "./util/palette";
import "./util/typography";

import "typeface-alegreya-sans";
import "typeface-raleway";

const drawerWidth = 240;

const customTheme = createMuiTheme({
  typography: {
    fontFamily: "Raleway",
    useNextVariants: true,
  },
});

const styles = (theme: Theme) =>
  createStyles({
    loading: {
      margin: "4px",
    },
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: palette.bg.appBar,
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      color: "white",
    },
    drawerPaper: {
      backgroundColor: palette.bg.drawerPaper,
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: "56px",
      // [theme.breakpoints.up("sm")]: {
      //   width: theme.spacing.unit * 9 + 1,
      // },
    },
    drawerLink: {
      textDecoration: "none",
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3,
    },
  });

interface Props {
  classes: any;
  theme: any;
}

enum SignedInState {
  LOADING,
  SIGNED_IN,
  SIGNED_OUT,
}

interface State {
  isSignedIn: SignedInState;
  drawerOpen: boolean;
  dialogOpen: boolean;
}

class App extends React.Component<Props, State> {
  public state = {
    isSignedIn: SignedInState.SIGNED_IN,
    drawerOpen: false,
    dialogOpen: false,
  };

  public handleSignOut = () => {
    // TODO: Sign out
    // fs.auth().signOut();
    this.setState({
      dialogOpen: false,
    });
  };

  public handleClickSignOut = () => {
    this.setState({
      dialogOpen: true,
    });
  };

  public handleDrawerOpen = () => {
    this.setState({ drawerOpen: true });
  };

  public handleDrawerClose = () => {
    this.setState({ drawerOpen: false });
  };

  public handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  };

  public render() {
    const { classes, theme } = this.props;

    let main;
    if (this.state.isSignedIn === SignedInState.SIGNED_OUT) {
      main = <Login />;
    } else if (this.state.isSignedIn === SignedInState.LOADING) {
      main = (
        <Typography className={classes.loading} variant="h4">
          <em>Loading...</em>
        </Typography>
      );
    } else {
      main = (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.drawerOpen,
            })}
          >
            <Toolbar disableGutters={!this.state.drawerOpen}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, {
                  [classes.hide]: this.state.drawerOpen,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap={true}>
                Volunteer Hub: Welcome, Sowmya Magham
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
              [classes.drawerOpen]: this.state.drawerOpen,
              [classes.drawerClose]: !this.state.drawerOpen,
            })}
            classes={{
              paper: classNames(classes.drawerPaper, {
                [classes.drawerOpen]: this.state.drawerOpen,
                [classes.drawerOpenPaper]: this.state.drawerOpen,
                [classes.drawerClose]: !this.state.drawerOpen,
                [classes.drawerClosePaper]: !this.state.drawerOpen,
              }),
            }}
            open={this.state.drawerOpen}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <Divider />
            <List>
              <Link className={classes.drawerLink} to={`/`} key="Home">
                <ListItem button={true}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
              </Link>
              <Link className={classes.drawerLink} to={`/tasks`} key="Tasks">
                <ListItem button={true}>
                  <ListItemIcon>
                    <DoneAllIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tasks" />
                </ListItem>
              </Link>
              <Link
                className={classes.drawerLink}
                to={`/content`}
                key="Content"
              >
                <ListItem button={true}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText primary="Content" />
                </ListItem>
              </Link>
              <Link
                className={classes.drawerLink}
                to={`/calendar`}
                key="Calendar"
              >
                <ListItem button={true}>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText primary="Calendar" />
                </ListItem>
              </Link>

              <ListItem button={true} onClick={this.handleClickSignOut}>
                <ListItemIcon>
                  <PowerSettingsNewIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItem>
            </List>
            <Divider />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/editcontent/:id" component={EditContent} />
              <Route path="/content" component={Content} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/calendar" component={Calendar} />
              <Route path="/" component={Home} />
            </Switch>
          </main>
          <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
            <DialogTitle>Log out?</DialogTitle>
            <DialogActions>
              <Button color="primary" onClick={this.handleDialogClose}>
                Cancel
              </Button>
              <Button
                onClick={this.handleSignOut}
                color="primary"
                autoFocus={true}
              >
                Sign Out
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }

    return <MuiThemeProvider theme={customTheme}>{main}</MuiThemeProvider>;
  }
}

export default withStyles(styles, { withTheme: true })(App);
