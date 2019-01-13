declare type Color =
  | "yellow"
  | "purple"
  | "blue"
  | "red"
  | "green"
  | "orange"
  | "black"
  | "sky"
  | "pink"
  | "lime"
  | "null";

declare interface TrelloLabel {
  id: string;
  idBoard: string;
  name: string;
  color: Color;
}
declare interface TrelloCard {
  id: string;
  idList: string;
  labels: TrelloLabel[];
  name: string;
  desc: string;
  idChecklists: string[];
}
declare interface TrelloChecklistItem {
  state: "complete" | "incomplete";
  id: string;
  name: string;
  nameData?: any;
  pos: number;
}
declare interface TrelloChecklist {
  id: string;
  idBoard: string;
  idCard: string;
  name: string;
  pos: number;
  checkItems: TrelloChecklistItem[];
}
declare interface TrelloList {
  id: string;
  name: string;
}
declare interface TrelloBoard {
  id: string;
  name: string;
}
declare interface ReactCard {
  id: string;
  title: string;
  description?: string;
  label?: string;
  metadata?: any;
}
declare interface ReactLane {
  id: string;
  title: string;
  label?: string;
  cards: ReactCard[];
}
declare interface ReactBoard {
  lanes: ReactLane[];
}

declare const Trello: any;

declare module "react-trello";
