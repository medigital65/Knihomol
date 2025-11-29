
export interface MediaData {
  type: 'Kniha' | 'Film';
  title: string;
  author: string; // Author for books, Director for films
  publicationYear: string;
  annotation: string;
  sourceUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppState {
  HOME,
  CAMERA,
  ANALYZING,
  DETAILS,
  CHAT,
}
