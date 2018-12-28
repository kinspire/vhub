declare interface Card extends Record<string, any> {
  id: string;
  idList: string;
}
declare interface List extends Record<string, any> {
  id: string;
}

declare const Trello: any;

declare module "react-trello";
