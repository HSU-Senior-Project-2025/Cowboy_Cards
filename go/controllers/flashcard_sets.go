package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
)

func (h *DBHandler) ListFlashcardSets(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/flashcards/sets/list | jq

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	flashcard_sets, err := query.ListFlashcardSets(ctx)
	if err != nil {
		logAndSendError(w, err, "Error getting flashcard sets from DB", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcard_sets); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) GetFlashcardSetById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/flashcards/sets/ -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	setID, ok := middleware.GetSetIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	flashcard_set, err := query.GetFlashcardSetById(ctx, setID)
	if err != nil {
		logAndSendError(w, err, "Failed to get flashcard set", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcard_set); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) CreateFlashcardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/flashcards/sets -H "name: Knights Errant" -H "description: collection of famous knights"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, set_name, set_description)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		middleware.LogAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tx, err := conn.Begin(ctx)
	if err != nil {
		logAndSendError(w, err, "Database tx connection error", http.StatusInternalServerError)
	}
	defer tx.Rollback(ctx)

	qtx := query.WithTx(tx)

	flashcard_set, err := qtx.CreateFlashcardSet(ctx, db.CreateFlashcardSetParams{
		SetName:        headerVals[set_name],
		SetDescription: headerVals[set_description],
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create flashcard set", http.StatusInternalServerError)
		return
	}

	err = qtx.JoinSet(ctx, db.JoinSetParams{
		UserID: userID,
		SetID:  flashcard_set.ID,
		Role:   owner,
	})
	if err != nil {
		logAndSendError(w, err, "Error adding set", http.StatusInternalServerError)
		return
	}

	err = tx.Commit(ctx)
	if err != nil {
		logAndSendError(w, err, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(flashcard_set); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) UpdateFlashcardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/api/flashcards/sets/set_name -H "id: 1" -H "set_name: Knights Errant"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	route := path.Base(r.URL.Path)

	headerVals, err := getHeaderVals(r, route)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	setID, ok := middleware.GetSetIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	val := headerVals[route]

	var res string
	switch route {
	case set_name:
		res, err = query.UpdateFlashcardSetName(ctx, db.UpdateFlashcardSetNameParams{
			SetName: val,
			ID:      setID,
		})
	case set_description:
		res, err = query.UpdateFlashcardSetDescription(ctx, db.UpdateFlashcardSetDescriptionParams{
			SetDescription: val,
			ID:             setID,
		})
	default:
		logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
		return
	}

	if err != nil {
		logAndSendError(w, err, "Failed to update flashcard set", http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(res); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) DeleteFlashcardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE http://localhost:8000/api/flashcards/sets -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	setID, ok := middleware.GetSetIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err = query.DeleteFlashcardSet(ctx, setID)
	if err != nil {
		logAndSendError(w, err, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}
