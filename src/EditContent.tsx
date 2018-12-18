import * as firebase from "firebase";
import * as React from "react";
import * as RRD from "react-router-dom";

import * as fs from "./firebaseService";

export interface IParams {
  id: string;
}

export interface IState {
  content?: firebase.firestore.DocumentSnapshot;
  error?: Error;
}

export default class Content extends React.Component<
  RRD.RouteComponentProps<IParams>,
  IState
> {
  private unregisterObserver: firebase.Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {};
  }

  public componentDidMount() {
    this.unregisterObserver = fs
      .db()
      .collection("content")
      .doc(this.props.match.params.id)
      .onSnapshot(
        snapshot => this.setState({ content: snapshot }),
        error => this.setState({ error })
      );
  }

  public componentWillUnmount() {
    this.unregisterObserver();
  }

  public render() {
    const { content } = this.state;
    if (!content) {
      return "Loading...";
    }

    let view;
    switch (content.get("type")) {
      case "story":
        view = (content.get("story") as string[]).map((line, i) => (
          <p key={i}>{line}</p>
        ));
        break;
      case "wordsearch":
        view = <pre>{(content.get("grid") as string[]).join("\n")}</pre>;
        break;
      default:
        view = "Unsupported content type.";
        break;
    }

    return (
      <div>
        <h1>{content.get("title")}</h1>
        <h2>{content.get("type")}</h2>
        {view}
      </div>
    );
  }
}
