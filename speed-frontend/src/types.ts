export interface Article {
  id: string;
  uid?: string;
  title: string;
  authors: string;
  journalName: string;
  yearOfPub: Date;
  vol?: string;
  pages?: string;
  doi?: string;
  SEP?: string;
  claim?: string;
  result?: string;
  submitterUid: string;
  status: string;
}
