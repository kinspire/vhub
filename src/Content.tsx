import * as firebase from "firebase";
import * as React from "react";
import { Link } from "react-router-dom";

import * as fs from "./firebaseService";

export interface IState {
  content: firebase.firestore.QueryDocumentSnapshot[];
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
          content: snapshot.docs
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
              <Link to={`/editcontent/${c.id}`}>
                {c.get("title")} &mdash; {c.get("type")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
