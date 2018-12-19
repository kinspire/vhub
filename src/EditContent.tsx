import * as firebase from "firebase";
import * as _ from "lodash";
import * as React from "react";
import * as RRD from "react-router-dom";

import * as fs from "./firebaseService";
import Story from "./Story";

export interface IParams {
  id: string;
}

export interface IState {
  content?: any;
  error?: Error;
}

const COLLECTION = "content";

export default class Content extends React.Component<
  RRD.RouteComponentProps<IParams>,
  IState
> {
  private unregisterObserver: firebase.Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {};

    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  public componentDidMount() {
    this.unregisterObserver = fs
      .db()
      .collection(COLLECTION)
      .doc(this.props.match.params.id)
      .onSnapshot(
        snapshot => this.setState({ content: snapshot.data() }),
        error => this.setState({ error })
      );
  }

  public componentWillUnmount() {
    this.unregisterObserver();
  }

  public handleChange(event: any) {
    let value = event.target.value;
    if (typeof this.state.content[event.target.name] === "number") {
      value = Number(event.target.value);
    }
    _.set(this.state.content, event.target.name, value);
    this.setState({});
  }

  public handleSave() {
    const content = _.cloneDeep(this.state.content);
    content.story = content.story.split("\n");
    fs.db()
      .collection(COLLECTION)
      .doc(this.props.match.params.id)
      .set(content, { merge: true });
  }

  public render() {
    const { content } = this.state;
    if (!content) {
      return "Loading...";
    }

    let view;
    switch (content.type) {
      case "story":
        view = (
          <Story
            {...content}
            onChange={this.handleChange}
            onSave={this.handleSave}
          />
        );
        break;
      case "wordsearch":
        view = <pre>{(content.grid as string[]).join("\n")}</pre>;
        break;
      default:
        view = "Unsupported content type.";
        break;
    }

    return (
      <div>
        <h1>{content.title}</h1>
        <h2>{content.type}</h2>
        {view}
      </div>
    );
  }
}
