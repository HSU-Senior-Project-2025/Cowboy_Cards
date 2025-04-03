package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

func (h *Embed) ListFlashcardSets(w http.ResponseWriter, r *http.Request) {
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

func (h *Embed) GetFlashcardSetById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/flashcards/sets/ -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	id, err := getInt32Id(headerVals["id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	flashcard, err := query.GetFlashcardSetById(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to get flashcard set", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcard); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) CreateFlashcardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/flashcards/sets -H "name: Knights Errant" -H "description: collection of famous knights"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "set_name", "set_description")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	flashcard_set, err := query.CreateFlashcardSet(ctx, db.CreateFlashcardSetParams{
		SetName:        headerVals["set_name"],
		SetDescription: headerVals["set_description"],
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create flashcard set", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(flashcard_set); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) UpdateFlashcardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/api/flashcards/sets/name -H "id: 1" -H "name: Dad Jokes"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	route := path.Base(r.URL.Path)

	headerVals, err := getHeaderVals(r, "id", route)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	id, err := getInt32Id(headerVals["id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	val := headerVals[route]

	var res string
	switch route {
	case "set_name":
		res, err = query.UpdateFlashcardSetName(ctx, db.UpdateFlashcardSetNameParams{
			SetName: val,
			ID:      id,
		})
	case "set_description":
		res, err = query.UpdateFlashcardSetDescription(ctx, db.UpdateFlashcardSetDescriptionParams{
			SetDescription: val,
			ID:             id,
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

func (h *Embed) DeleteFlashcardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE http://localhost:8000/api/flashcards/sets -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	id, err := getInt32Id(headerVals["id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	err = query.DeleteFlashcardSet(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}
