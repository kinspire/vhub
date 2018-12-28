import * as firebase from "firebase";
import * as _ from "lodash";
import * as React from "react";
import * as RRD from "react-router-dom";

import * as fs from "../services/firebaseService";
import Story from "./Story";

export interface Params {
  id: string;
}

export interface State {
  content?: any;
  error?: Error;
}

const COLLECTION = "content";

// TODO get rid of clone deeps
export default class EditContent extends React.Component<
  RRD.RouteComponentProps<Params>,
  State
> {
  private unregisterObserver: firebase.Unsubscribe;

  constructor(props: any) {
    super(props);

    this.state = {};

    this.handleAddParagraph = this.handleAddParagraph.bind(this);
    this.handleDeleteParagraph = this.handleDeleteParagraph.bind(this);
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

  public handleAddParagraph() {
    const content = _.cloneDeep(this.state.content);
    (content.story as string[]).push("");
    this.setState({ content });
  }

  public handleDeleteParagraph(i: number) {
    const content = _.cloneDeep(this.state.content);
    _.pullAt(content.story, i);
    this.setState({ content });
  }

  public handleChange(event: any) {
    let value = event.target.value;
    if (typeof _.get(this.state.content, event.target.name) === "number") {
      value = Number(event.target.value);
    } else {
      value = (value as string).replace("\n", "");
    }
    const content = _.cloneDeep(this.state.content);
    _.set(content, event.target.name, value);
    this.setState({ content });
  }

  public handleSave() {
    fs.db()
      .collection(COLLECTION)
      .doc(this.props.match.params.id)
      .set(this.state.content, { merge: true })
      .then(() => alert("Saved!"))
      .catch(err => alert(JSON.stringify(err)));
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
            onDeleteParagraph={this.handleDeleteParagraph}
            onAddParagraph={this.handleAddParagraph}
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
