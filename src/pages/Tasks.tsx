import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import * as log from "loglevel";
import * as React from "react";
import Board from "react-trello";

import * as util from "../util/trelloUtil";

interface State {
  boardData: any;
  boards: any[];
  currentBoard: string;
  labels: Label[];
}

export default class Tasks extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      boardData: {
        lanes: [],
      },
      boards: [],
      currentBoard: "",
      labels: [],
    };

    this.handleAuthorized = this.handleAuthorized.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public componentDidMount() {
    Trello.authorize({
      error: alert,
      expiration: "never",
      name: "Kinspire's Volunteer Hub",
      scope: {
        read: "true",
        write: "true",
      },
      success: this.handleAuthorized,
      type: "popup",
    });
  }

  public handleAuthorized() {
    log.debug("authorized");
    util
      .get(`/organizations/${util.ORGANIZATION_ID}/boards`, {
        filter: "open",
      })
      .then(boards =>
        this.setState({ boards, currentBoard: boards[0].id }, this.fetchBoard)
      );
  }

  public fetchBoard() {
    Promise.all([
      util.get(`/boards/${this.state.currentBoard}/lists/open`) as Promise<
        List[]
      >,
      util.get(`/boards/${this.state.currentBoard}/labels`) as Promise<Label[]>,
    ])
      .then(([lists, labels]) => {
        this.setState({ labels });

        return Promise.all(
          lists.map(list =>
            Promise.all([
              Promise.resolve(list),
              util.get(`/lists/${list.id}/cards`) as Promise<Card[]>,
            ])
          )
        );
      })
      .then(res => {
        // Main conversion of Trello data format to React Trello format
        const lanes = res.map(([list, cards]) => {
          return Object.assign(list, {
            cards: cards.map(card => ({
              description: card.desc,
              style: {
                backgroundColor: card.labels.length
                  ? util.colorMap(card.labels[0].color)
                  : undefined,
              },
              title: card.name,
              ...card,
            })),
            title: list.name,
          });
        });

        this.setState({ boardData: { lanes } });
      })
      .catch(err => alert(err));
  }

  public handleChange(event: React.FormEvent) {
    log.debug("queried");
    const boardId = (event.target as any).value;
    this.setState(
      {
        currentBoard: boardId,
      },
      this.fetchBoard
    );
  }

  public render() {
    const data = this.state.boardData;

    const boards = this.state.boards.map(b => (
      <MenuItem key={b.id} value={b.id}>
        {b.name}
      </MenuItem>
    ));

    const labels = this.state.labels
      .filter(l => l.name)
      .map(l => (
        <span
          key={l.id}
          style={{
            backgroundColor: util.colorMap(l.color),
            margin: "0 4px",
            padding: "2px",
          }}
        >
          {l.name}
        </span>
      ));

    return (
      <div>
        <FormControl>
          <InputLabel htmlFor="currentBoard">Choose Board</InputLabel>
          <Select
            value={this.state.currentBoard}
            onChange={this.handleChange}
            inputProps={{
              id: "currentBoard",
              name: "currentBoard",
            }}
          >
            {boards}
          </Select>
        </FormControl>
        This board's labels:
        {labels}
        <Board data={data} />
      </div>
    );
  }
}
