export interface Article {
  id: string;
  uid?: string;
  title: string;
  authors: string;
  journalName: string;
  yearOfPub: number;
  vol?: string;
  pages?: string;
  doi?: string;
  SEP?: string;
  claim?: string;
  result?: string;
  moderatorUid?: string;
  analystUid?: string;
  submitterUid: string;
  status: string;
  reviewNote?: string;
  modNote?: string;
}