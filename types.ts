
export interface StoryResult {
  story: string;
  imageUrl: string;
}

// Quiz types
export interface Mascot {
  id: string;
  emoji: string;
  name: string;
  color: string;
  bgGradient: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  difficulty: string;
  solved: number;
  total: number;
  sheetUrl: string; // Google Sheets URL for this module
  worksheetNumber?: number; // Optional worksheet/tab number (e.g., 1, 2, 3, 4)
  worksheetGid?: string; // Optional worksheet GID for Google Sheets
}

export interface Question {
  id: string;
  text: string;
  note?: string;
  hint?: string;
  knowMore?: string; // URL for Know More link
  knowMoreText?: string; // Description text for popup
  imageUrl?: string;
  youtubeUrl?: string; // YouTube video URL for Know More modal
  answers: Answer[];
  correctAnswer: string;
  topic: string;
  worksheetNumber?: number; // Worksheet number from Google Sheets data
  // New fields for question types
  questionType?: 'MCQ' | 'TTA' | 'FIB' | 'SEQUENCE'; // Question format type
  is_fib?: boolean; // Indicates Fill in the Blank question
  fib_sentence?: string; // Sentence with blank (e.g., "The _____ is hot")
  multipleAnswers?: string; // Pipe-separated allowed answers (e.g., "red|blue|green")
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface Answer {
  id: string;
  text: string;
}

export interface WrongAnswer {
  questionId: string;
  questionText: string;
  correctAnswerText: string;
  userAnswerText: string;
}

export interface QuizState {
  currentScreen: 'login' | 'landing' | 'question' | 'result';
  playerName: string;
  selectedMascot: string;
  interfaceStyle: 'kid' | 'minimal';
  randomize: boolean;
  selectedTopic: Topic | null;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Record<string, string>;
  score: number;
  xp: number;
  currentWorksheetId?: string; // ID of the currently selected worksheet package
}
