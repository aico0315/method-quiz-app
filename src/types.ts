export type Level = "junior" | "middle" | "senior";

export interface Question {
  id: string;
  level: Level;
  category: string;
  question: string;
  answer: string[];
  supplement: string;
}

export type Screen = "menu" | "quiz" | "clear";
