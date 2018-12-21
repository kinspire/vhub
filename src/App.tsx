import { Button } from "@material-ui/core";
import * as React from "react";
import { Link, Route, Switch } from "react-router-dom";

import "./index.scss";
import Content from "./pages/Content";
import EditContent from "./pages/EditContent";
import Home from "./pages/Home";
import Login from "./pages/Login";

import * as fs from "./firebaseService";
import "./util/typography";

import "typeface-cormorant-infant";
import "typeface-raleway";

export interface IState {
  isSignedIn: boolean;
}

const HomeLink = (props: any) => <Link to="/" {...props} />;
const ContentLink = (props: any) => <Link to="/content" {...props} />;

class App extends React.Component<{}, IState> {
  private unregisterAuthObserver: firebase.Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      isSignedIn: false
    };
  }

  /**
   * @inheritDoc
   */
  public componentDidMount() {
    this.unregisterAuthObserver = fs
      .auth()
      .onAuthStateChanged((user: firebase.User) => {
        this.setState({ isSignedIn: !!user });
      });
  }

  /**
   * @inheritDoc
   */
  public componentWillUnmount() {
    if (this.unregisterAuthObserver) {
      this.unregisterAuthObserver();
    }
  }

  public handleSignOut() {
    fs.auth().signOut();
  }

  public render() {
    if (this.state.isSignedIn !== undefined && !this.state.isSignedIn) {
      return <Login />;
    } else if (!this.state.isSignedIn) {
      return "Loading...";
    }

    const user = fs.auth().currentUser;

    return (
      <div>
        Hello there {user ? user.displayName : "not logged in"}
        <Button
          variant="contained"
          color="secondary"
          onClick={this.handleSignOut}
        >
          Sign out
        </Button>
        <Button component={HomeLink} variant="outlined">
          Home
        </Button>
        <Button variant="outlined" component={ContentLink}>
          Content
        </Button>
        <Switch>
          <Route path="/editcontent/:id" component={EditContent} />
          <Route path="/content" component={Content} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
