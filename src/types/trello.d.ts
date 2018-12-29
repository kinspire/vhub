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

declare interface Label extends Record<string, any> {
  id: string;
  idBoard: string;
  name: string;
  color: Color;
}
declare interface Card extends Record<string, any> {
  id: string;
  idList: string;
  labels: Label[];
}
declare interface List extends Record<string, any> {
  id: string;
}

declare const Trello: any;

declare module "react-trello";
