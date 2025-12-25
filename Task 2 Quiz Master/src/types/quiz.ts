export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface QuizResult {
  questionId: string;
  selectedAnswerId: string | null;
  isCorrect: boolean;
}
