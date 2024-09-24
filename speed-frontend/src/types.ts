export interface Article {
  id: string;
  title: string;
  authors: string;
  journalName: string;
  yearOfPub: number;
  vol?: number;
  pages?: number;
  doi?: string;
  SEP?: string;
  claim?: string;
  result?: string;
}
