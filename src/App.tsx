import { Button } from "@material-ui/core";
import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Content from "./Content";
import Home from "./Home";
import "./index.scss";
import Login from "./Login";

import * as fs from "./firebaseService";

export interface IState {
  isSignedIn: boolean;
}

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
        <Button variant="outlined" onClick={this.handleSignOut}>
          Sign out
        </Button>
        <Switch>
          <Route path="/content" component={Content} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    );
  }
}

export default App;
