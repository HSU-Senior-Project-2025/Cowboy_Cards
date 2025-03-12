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

func (pool *Pool) CreateFlashCard(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/flashcard -H "front: front test" -H "back: back test" -H "set_id: 1"

	front := r.Header.Get("front")
	back := r.Header.Get("back")
	setIDStr := r.Header.Get("set_id")
	if front == "" || back == "" || setIDStr == "" {
		http.Error(w, "missing required headers", http.StatusBadRequest)
		return
	}

	setID, err := strconv.Atoi(setIDStr)
	if err != nil {
		http.Error(w, "Invalid 'set_id' header", http.StatusBadRequest)
		return
	}

	setIDInt := int32(setID)

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.CreateFlashCard(ctx, db.CreateFlashCardParams{
		Front: front,
		Back:  back,
		SetID: setIDInt,
	})
	if error != nil {
		log.Printf("error creating flashcard in db: %v", err)
		http.Error(w, "Failed to create flashcard", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard created successfully")
}

func (pool *Pool) GetFlashCard(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/flashcard -H "id: 1"

	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "missing 'id' header", http.StatusBadRequest)
		return
	}

	flashcardID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
		return
	}

	id := int32(flashcardID)
	if id == 0 {
		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	flashcard, err := query.GetFlashCard(ctx, int32(id))
	if err != nil {
		log.Fatalf("error getting flash card sets from db... %v", err)
	}
	log.Println("data: ", flashcard)
	log.Println()

	b, err := json.Marshal(flashcard)
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline
}

func (pool *Pool) UpdateFlashCard(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/flashcard -H "id: 1" -H "front: front test" -H "back: back test"

	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "missing 'id' header", http.StatusBadRequest)
		return
	}

	flashcardID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	id := int32(flashcardID)
	if id == 0 {
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	front := r.Header.Get("front")
	back := r.Header.Get("back")
	if front == "" && back == "" {
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

	error := query.UpdateFlashCard(ctx, db.UpdateFlashCardParams{
		ID:    id,
		Front: front,
		Back:  back,
	})
	if error != nil {
		log.Printf("error updating flashcard in db: %v", err)
		http.Error(w, "Failed to update flashcard", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard updated successfully")
}

func (pool *Pool) DeleteFlashCard(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/flashcard -H "id: 1"

	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "missing 'id' header", http.StatusBadRequest)
		return
	}

	flashcardID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	id := int32(flashcardID)
	if id == 0 {
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

	error := query.DeleteFlashCard(ctx, id)
	if error != nil {
		log.Printf("error deleting flashcard in db: %v", err)
		http.Error(w, "Failed to delete flashcard", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard deleted successfully")
}
