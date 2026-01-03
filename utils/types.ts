export interface Board {
  id: string;
  name: string;
  lists: string[]; // array of list ids
  revision: number;
}

export interface List {
  id: string;
  name: string;
  cards: string[]; // array of card ids
  revision: number;
  editing?:boolean;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  comments: string[]; // array of comment ids
  revision: number;
  selected?: boolean;
  editing?:boolean;

}

export interface Comment {
  id: string;
  text: string;
  author?: string;
  timestamp: Date;
  revision: number;
}

export interface BoardState {
  board: Board;
  lists: Record<string, List>;
  cards: Record<string, Card>;
  comments: Record<string, Comment>;
}