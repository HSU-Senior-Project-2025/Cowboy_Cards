package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"
	"strings"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

func (h *Embed) GetFlashcardById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/flashcards/ -H "id: 1"

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

	flashcard, err := query.GetFlashcardById(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to get flashcard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcard); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) ListFlashcardsOfASet(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/flashcards/list -H "set_id:1"| jq

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "set_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	set_id, err := getInt32Id(headerVals["set_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	flashcards, err := query.ListFlashcardsOfASet(ctx, set_id)
	if err != nil {
		logAndSendError(w, err, "Error getting flashcards from DB", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(flashcards); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) CreateFlashcard(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/flashcards -H "front: test front" -H "back: back test" -H "set_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "front", "back", "set_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	sid, err := getInt32Id(headerVals["set_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	flashcard, err := query.CreateFlashcard(ctx, db.CreateFlashcardParams{
		Front: headerVals["front"],
		Back:  headerVals["back"],
		SetID: sid,
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create flashcard", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(flashcard); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) UpdateFlashcard(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/api/flashcards/front -H "id: 1" -H "front: Who is Don Quixote?"

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

	if strings.HasSuffix(route, "id") {
		var res int32
		switch route {
		case "set_id":
			sid, err := getInt32Id(val)
			if err != nil {
				logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
				return
			}

			res, err = query.UpdateFlashcardSetId(ctx, db.UpdateFlashcardSetIdParams{
				SetID: sid,
				ID:    id,
			})
			if err != nil {
				logAndSendError(w, err, "Failed to update flashcard", http.StatusInternalServerError)
				return
			}
		default:
			logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(res); err != nil {
			logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
		}
	} else {
		var res string
		switch route {
		case "front":
			res, err = query.UpdateFlashcardFront(ctx, db.UpdateFlashcardFrontParams{
				Front: val,
				ID:    id,
			})
		case "back":
			res, err = query.UpdateFlashcardBack(ctx, db.UpdateFlashcardBackParams{
				Back: val,
				ID:   id,
			})
		default:
			logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
			return
		}

		if err != nil {
			logAndSendError(w, err, "Failed to update flashcard", http.StatusInternalServerError)
			return
		}
		if err := json.NewEncoder(w).Encode(res); err != nil {
			logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func (h *Embed) DeleteFlashcard(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE http://localhost:8000/api/flashcards/ -H "id: 1"

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

	err = query.DeleteFlashcard(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to delete flashcard", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}
