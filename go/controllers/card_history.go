package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
)

func (h *DBHandler) UpdateFlashcardScore(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/card_history/correct -H "card_id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	headerVals, err := getHeaderVals(r, card_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	cardID, err := getInt32Id(headerVals[card_id])
	if err != nil {
		logAndSendError(w, err, "Invalid card id", http.StatusBadRequest)
		return
	}

	switch path.Base(r.URL.Path) {
	case correct:
		err = query.UpsertCorrectFlashcardScore(ctx, db.UpsertCorrectFlashcardScoreParams{
			UserID: userID,
			CardID: cardID,
		})
	case incorrect:
		err = query.UpsertIncorrectFlashcardScore(ctx, db.UpsertIncorrectFlashcardScoreParams{
			UserID: userID,
			CardID: cardID,
		})
	default:
		logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
		return
	}
	if err != nil {
		logAndSendError(w, err, "Error updating score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated) // TODO - WriteHeader insert case only, not update case
	if err = json.NewEncoder(w).Encode("Score updated"); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *DBHandler) GetCardScore(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/card_history/ -H "card_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	headerVals, err := getHeaderVals(r, card_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	cardID, err := getInt32Id(headerVals[card_id])
	if err != nil {
		logAndSendError(w, err, "Invalid card id", http.StatusBadRequest)
		return
	}

	score, err := query.GetCardScore(ctx, db.GetCardScoreParams{
		UserID: userID,
		CardID: cardID,
	})
	if err != nil {
		logAndSendError(w, err, "Error getting score", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(score); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *DBHandler) GetScoresInASet(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/card_history/set -H "user_id: 1" -H "set_id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	headerVals, err := getHeaderVals(r, set_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	setID, err := getInt32Id(headerVals[set_id])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	scores, err := query.GetScoresInASet(ctx, db.GetScoresInASetParams{
		UserID: userID,
		SetID:  setID,
	})
	if err != nil {
		logAndSendError(w, err, "Error getting scores", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(scores); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}
