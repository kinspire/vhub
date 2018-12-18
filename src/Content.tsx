import * as firebase from "firebase";
import * as React from "react";

import * as fs from "./firebaseService";

export interface IState {
  content: any[];
}

export default class Content extends React.Component<{}, IState> {
  private unregisterObserver: firebase.Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {
      content: []
    };
  }

  public componentDidMount() {
    this.unregisterObserver = fs
      .db()
      .collection("content")
      .onSnapshot(snapshot => {
        this.setState({
          content: snapshot.docs.map(d => d.data())
        });
      });
  }

  public componentWillUnmount() {
    this.unregisterObserver();
  }

  public render() {
    return (
      <div>
        Content:
        <ul>
          {this.state.content.map(c => (
            <li>
              {c.title} &mdash; {c.type}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
