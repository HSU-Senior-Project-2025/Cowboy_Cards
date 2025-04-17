/**
 * @file src/types/flashcards.ts
 * Purpose: Defines shared TypeScript types and interfaces related to flashcards and sets.
 * These types correspond **exactly** to the data structures defined in the Go backend (`go/db/models.go`).
 */

/**
 * Represents a single flashcard.
 * Matches the `db.Flashcard` struct from the Go backend.
 */
export interface Flashcard {
  /** Corresponds to `db.Flashcard.ID` (int32) */
  ID: number;
  /** Corresponds to `db.Flashcard.Front` (string) */
  Front: string;
  /** Corresponds to `db.Flashcard.Back` (string) */
  Back: string;
  /** Corresponds to `db.Flashcard.SetID` (int32) */
  SetID: number;
  /** Corresponds to `db.Flashcard.CreatedAt` (pgtype.Timestamp) - Expect ISO 8601 string format */
  CreatedAt: string;
  /** Corresponds to `db.Flashcard.UpdatedAt` (pgtype.Timestamp) - Expect ISO 8601 string format */
  UpdatedAt: string;
  // Note: Fields like DifficultyLevel are not part of the core backend model.
}

/**
 * Represents a collection of flashcards (a set).
 * Matches the `db.FlashcardSet` struct from the Go backend.
 */
export interface FlashcardSet {
  /** Corresponds to `db.FlashcardSet.ID` (int32) */
  SetID: number;
  /** Corresponds to `db.FlashcardSet.SetName` (string) */
  SetName: string;
  /** Corresponds to `db.FlashcardSet.SetDescription` (string) */
  SetDescription: string;
  /** Corresponds to `db.FlashcardSet.CreatedAt` (pgtype.Timestamp) - Expect ISO 8601 string format */
  CreatedAt: string;
  /** Corresponds to `db.FlashcardSet.UpdatedAt` (pgtype.Timestamp) - Expect ISO 8601 string format */
  UpdatedAt: string;
  // Note: UserID is not part of this model directly, likely managed via SetUser.
}

/**
 * Represents the relationship between a user and a flashcard set, including roles and scores.
 * Matches the `db.SetUser` struct from the Go backend.
 */
export interface SetUser {
  /** Corresponds to `db.SetUser.UserID` (int32) */
  UserID: number;
  /** Corresponds to `db.SetUser.SetID` (int32) */
  SetID: number;
  /** Corresponds to `db.SetUser.Role` (string) - e.g., 'owner', 'editor', 'viewer' */
  Role: string;
  /** Corresponds to `db.SetUser.SetScore` (int32) - User's score within this set */
  SetScore: number;
  /** Corresponds to `db.SetUser.IsPrivate` (bool) - Whether this association is private */
  IsPrivate: boolean;
  /** Corresponds to `db.SetUser.SetName` (string) */
  SetName: string;
  /** Corresponds to `db.SetUser.SetDescription` (string) */
  SetDescription: string;
}

/**
 * Represents a user's interaction history with a specific flashcard.
 * Matches the `db.CardHistory` struct from the Go backend.
 */
export interface CardHistory {
  /** Corresponds to `db.CardHistory.UserID` (int32) */
  UserID: number;
  /** Corresponds to `db.CardHistory.CardID` (int32) */
  CardID: number;
  /** Corresponds to `db.CardHistory.Score` (int32) - Current score/proficiency */
  Score: number;
  /** Corresponds to `db.CardHistory.TimesAttempted` (int32) */
  TimesAttempted: number;
  /** Corresponds to `db.CardHistory.IsMastered` (bool) */
  IsMastered: boolean;
  /** Corresponds to `db.CardHistory.CreatedAt` (pgtype.Timestamp) - Expect ISO 8601 string format */
  CreatedAt: string;
  // Note: Fields like Status, LastReviewed, NextReviewDate, EaseFactor, Interval
  // are not directly part of the core backend model
}
