import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import * as log from "loglevel";
import * as React from "react";
import Board from "react-trello";

import * as trello from "../services/trelloService";

interface State {
  boardData: any;
  boards: any[];
  currentBoard: string;
}

enum ElementName {
  currentBoard = "currentBoard",
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
    trello
      .get(`/organizations/${trello.ORGANIZATION_ID}/boards`, {
        filter: "open",
      })
      .then(boards => this.setState({ boards }));
  }

  public fetchBoard(boardId: string) {
    (trello.get(`/boards/${boardId}/lists/open`) as Promise<List[]>)
      .then(lists =>
        Promise.all(
          lists.map(list =>
            Promise.all([
              Promise.resolve(list),
              trello.get(`/lists/${list.id}/cards`) as Promise<Card[]>,
            ])
          )
        )
      )
      .then(res => {
        // Main conversion of Trello data format to React Trello format
        const lanes = res.map(([list, cards]) => {
          return Object.assign(list, {
            cards: cards.map(card => ({ title: card.name, ...card })),
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
    this.setState({
      [(event.target as any).name as ElementName]: boardId,
    });
    this.fetchBoard(boardId);
  }

  public render() {
    const data = this.state.boardData;

    const boards = this.state.boards.map(b => (
      <MenuItem key={b.id} value={b.id}>
        {b.name}
      </MenuItem>
    ));

    return (
      <div>
        Your boards:
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
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {boards}
          </Select>
        </FormControl>
        <Board data={data} />
      </div>
    );
  }
}
