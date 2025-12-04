
export interface MediaData {
  type: 'Kniha' | 'Film';
  title: string;
  author: string; // Author for books, Director for films
  publicationYear: string;
  annotation: string;
  sourceUrl: string;
  pin: string;
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

export interface AppSettings {
  analysisPrompt: string;
  chatSystemInstruction: string;
}
