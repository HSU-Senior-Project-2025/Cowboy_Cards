package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

func (h *Embed) UpsertCorrectFlashcardScore(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/card_history/incscore -H "user_id: 1" -H "card_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id", "card_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}
	cid, err := getInt32Id(headerVals["card_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid card id", http.StatusBadRequest)
		return
	}

	err = query.UpsertCorrectFlashcardScore(ctx, db.UpsertCorrectFlashcardScoreParams{
		UserID: uid,
		CardID: cid,
	})

	if err != nil {
		logAndSendError(w, err, "Error updating score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated) // TODO - WriteHeader insert case only, not update case
	if err = json.NewEncoder(w).Encode("Score updated"); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *Embed) UpsertIncorrectFlashcardScore(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/card_history/decscore -H "user_id: 1" -H "card_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id", "card_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}
	cid, err := getInt32Id(headerVals["card_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid card id", http.StatusBadRequest)
		return
	}

	err = query.UpsertIncorrectFlashcardScore(ctx, db.UpsertIncorrectFlashcardScoreParams{
		UserID: uid,
		CardID: cid,
	})

	if err != nil {
		logAndSendError(w, err, "Error updating score", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated) // TODO - WriteHeader insert case only, not update case
	if err = json.NewEncoder(w).Encode("Score updated"); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *Embed) GetCardScore(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/card_history/ -H "user_id: 1" -H "card_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id", "card_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}
	cid, err := getInt32Id(headerVals["card_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid card id", http.StatusBadRequest)
		return
	}

	score, err := query.GetCardScore(ctx, db.GetCardScoreParams{
		UserID: uid,
		CardID: cid,
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

func (h *Embed) GetScoresInASet(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/card_history/set -H "user_id: 1" -H "set_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id", "set_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}
	sid, err := getInt32Id(headerVals["set_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	scores, err := query.GetScoresInASet(ctx, db.GetScoresInASetParams{
		UserID: uid,
		SetID:  sid,
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
