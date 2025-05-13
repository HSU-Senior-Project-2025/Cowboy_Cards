export interface Class {
  ID: number;
  ClassName: string;
  ClassDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
  Role: string;
}

export interface Flashcard {
  ID: number;
  Front: string;
  Back: string;
  SetID: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface FlashcardSet {
  ID: number;
  SetName: string;
  SetDescription: string;
  CreatedAt: string;
  UpdatedAt: string;
  Role: string;
}

// to hide first and last name from GetClassLeaderboardRow go type
export interface GetClassScoresRow {
  UserID: number;
  Username: string;
  ClassScore: number;
}

export interface ListClassesOfAUserRow {
  ClassID: number;
  Role: string;
  ClassName: string;
  ClassDescription: string;
}

export interface ListMembersOfAClassRow {
  UserID: number;
  ClassID: number;
  Role: string;
  FirstName: string;
  LastName: string;
  Username: string;
}

export interface ListSetsOfAUserRow {
  SetID: number;
  Role: string;
  SetName: string;
  SetDescription: string;
}

export interface NewClass {
  ClassName: string;
  ClassDescription: string;
}

export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  login_streak: number;
  created_at: string;
  numClasses: number;
  cardsStudied: number;
  totalCardViews: number;
  totalScore: number;
}
