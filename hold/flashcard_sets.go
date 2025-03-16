package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5"
)

func (h *Handler) CreateFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/flashcard/set -H "name: test" -H "description: test"

	name := r.Header.Get("name")
	description := r.Header.Get("description")
	if name == "" || description == "" {
		http.Error(w, "missing required headers", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.CreateFlashCardSet(ctx, db.CreateFlashCardSetParams{
		Name:        name,
		Description: description,
	})
	if error != nil {
		log.Printf("error creating flashcard set in db: %v", err)
		http.Error(w, "Failed to create flashcard set", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard set created successfully")
}

func (h *Handler) GetFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/flashcard/set -H "id: 1"
	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "missing 'id' header", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)
	query := db.New(conn)
	flashcard_set, err := query.GetFlashCardSet(ctx, int32(id))
	if err != nil {
		log.Fatalf("error getting flash card sets from db... %v", err)
	}
	log.Println("data: ", flashcard_set)
	log.Println()
	b, err := json.Marshal(flashcard_set)
	if err != nil {
		log.Println("error:", err)
	}
	w.Write(append(b, 10)) //add newline
}

func (h *Handler) UpdateFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/flashcard/set -H "id: 1" -H "name: test" -H "description: test"

	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "missing 'id' header", http.StatusBadRequest)
		return
	}

	name := r.Header.Get("name")
	description := r.Header.Get("description")
	if name == "" && description == "" {
		http.Error(w, "missing required headers", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.UpdateFlashCardSet(ctx, db.UpdateFlashCardSetParams{
		ID:          int32(id),
		Name:        name,
		Description: description,
	})
	if error != nil {
		log.Printf("error updating flashcard set in db: %v", err)
		http.Error(w, "Failed to update flashcard set", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard set updated successfully")
}

func (h *Handler) DeleteFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/flashcard/set -H "id: 1"

	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "missing 'id' header", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.DeleteFlashCardSet(ctx, int32(id))
	if error != nil {
		log.Printf("error deleting flashcard set in db: %v", err)
		http.Error(w, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard set deleted successfully")
}
