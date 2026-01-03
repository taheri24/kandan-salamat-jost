export type ID = string;

export interface Board {
  id: ID;
  name: string;
  lists: ID[]; // array of list ids
  revision: number;
}

export interface List {
  id: ID;
  name: string;
  cards: ID[]; // array of card ids
  revision: number;
  editing?:boolean;
  draggingTimeStamp?:number;
  dragging?:boolean;
}

export interface Card {
  id: ID;
  title: string;
  description?: string;
  comments: ID[]; // array of comment ids
  revision: number;
  selected?: boolean;
  editing?:boolean;

}

export interface Comment {
  id: ID;
  text: string;
  author?: string;
  timestamp: Date;
  revision: number;
}

export interface BoardState {
  board: Board;
  draggingSourceID?: ID;
  dragOverID?: ID;
  dragOverListID?: ID;
  lists: Record<ID, List>;
  cards: Record<ID, Card>;
  comments: Record<ID, Comment>;
}