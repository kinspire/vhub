import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import * as _ from "lodash";
import * as log from "loglevel";
import * as React from "react";
import * as Modal from "react-modal";
import Board from "react-trello";

import * as util from "../util/trelloUtil";

interface State {
  boardData: ReactBoard;
  boards: TrelloBoard[];
  currentBoard: string;
  currentCard: TrelloCard | null;
  currentChecklist: TrelloChecklist | null;
  labels: TrelloLabel[];
}

Modal.setAppElement("#root");

export default class Tasks extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      boardData: {
        lanes: [],
      },
      boards: [],
      currentBoard: "",
      currentCard: null,
      currentChecklist: null,
      labels: [],
    };

    this.handleAuthorized = this.handleAuthorized.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCardClick = this.handleCardClick.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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

  public handleCloseModal() {
    this.setState({
      currentCard: null,
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

  public handleCardClick(_cardId: string, metadata: TrelloCard) {
    let promise: Promise<TrelloChecklist | null>;
    if (metadata.idChecklists.length) {
      promise = util.get(`/checklists/${metadata.idChecklists[0]}`);
    } else {
      promise = Promise.resolve(null);
    }
    promise.then(c => {
      this.setState({
        currentCard: metadata,
        currentChecklist: c,
      });
    });
  }

  public fetchBoard() {
    let labels: TrelloLabel[];

    Promise.all([
      util.get(`/boards/${this.state.currentBoard}/lists/open`) as Promise<
        TrelloList[]
      >,
      util.get(`/boards/${this.state.currentBoard}/labels`) as Promise<
        TrelloLabel[]
      >,
    ])
      .then(([lists, newLabels]) => {
        labels = newLabels;

        return Promise.all(
          lists.map(list =>
            Promise.all([
              Promise.resolve(list),
              util.get(`/lists/${list.id}/cards`) as Promise<TrelloCard[]>,
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
              id: card.id,
              metadata: card,
              style: {
                backgroundColor: card.labels.length
                  ? util.colorMap(card.labels[0].color)
                  : undefined,
              },
              title: card.name,
            })),
            title: list.name,
          });
        });

        this.setState({ boardData: { lanes }, labels });
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
    const {
      boardData,
      boards,
      labels,
      currentCard,
      currentBoard,
      currentChecklist,
    } = this.state;

    const boardViews = boards.map(b => (
      <MenuItem key={b.id} value={b.id}>
        {b.name}
      </MenuItem>
    ));

    const labelViews = labels
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

    let modal;
    if (currentCard) {
      modal = (
        <div>
          <h2>{currentCard.name}</h2>
          <p>{currentCard.desc}</p>
          <ul>
            {currentChecklist
              ? currentChecklist.checkItems.map(item => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.state === "complete"}
                        disabled={true}
                      />
                    }
                    key={item.id}
                    label={item.name}
                  />
                ))
              : ""}
          </ul>
        </div>
      );
    }

    return (
      <div>
        <FormControl>
          <InputLabel htmlFor="currentBoard">Choose Board</InputLabel>
          <Select
            value={currentBoard}
            onChange={this.handleChange}
            inputProps={{
              id: "currentBoard",
              name: "currentBoard",
            }}
          >
            {boardViews}
          </Select>
        </FormControl>
        This board's labels:
        {labelViews}
        <Board data={boardData} onCardClick={this.handleCardClick} />
        <Modal
          isOpen={!!currentCard}
          onRequestClose={this.handleCloseModal}
          contentLabel="Card Detail"
        >
          {modal}
        </Modal>
      </div>
    );
  }
}
