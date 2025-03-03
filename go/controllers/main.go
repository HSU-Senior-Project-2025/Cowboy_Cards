package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
)

type Config struct {
	DB *pgx.ConnConfig
}

func (cfg *Config) GetClasses(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	// log.Println("env", cfg.DB)

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	classes, err := query.GetClasses(ctx)
	if err != nil {
		log.Fatalf("error getting classes from db... %v", err)
	}
	log.Println("data: ", classes[0])
	log.Println()

	b, err := json.Marshal(classes)
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline
}

func (cfg *Config) GetUsersFlashCardSets(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/flashcard_sets -H "user_id: 11"

	userIDStr := r.Header.Get("user_id")
	if userIDStr == "" {
		http.Error(w, "missing 'user_id' header", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
		return
	}

	id := int32(userID)
	if id == 0 {
		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	flashcard_sets, err := query.GetUsersFlashCardSets(ctx, int32(id))
	if err != nil {
		log.Printf("error getting flash card sets from db: %v", err)
		http.Error(w, "Failed to get flashcard sets", http.StatusInternalServerError)
		return
	}

	// Safely handle empty results
	if len(flashcard_sets) > 0 {
		log.Println("data: ", flashcard_sets[0])
	} else {
		log.Println("No flashcard sets found for user")
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(flashcard_sets)
}

func (cfg *Config) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	users, err := query.GetUsers(ctx)
	if err != nil {
		log.Fatalf("error getting users from db... %v", err)
	}
	log.Println("data: ", users)
	log.Println()

	b, err := json.Marshal(users)
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline

}

func (cfg *Config) GetUser(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		log.Fatalf("could not parse query param as int... %v", err)
	}

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	user, err := query.GetUser(ctx, int32(id))
	if err != nil {
		log.Fatalf("error getting user from db... %v", err)
	}
	log.Println("data: ", user)
	log.Println()

	b, err := json.Marshal(user)
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline

}

func (cfg *Config) CreateFlashCard(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/flashcard -H "front: front test" -H "back: back test" -H "set_id: 1" -H "user_id: 123"

	front := r.Header.Get("front")
	back := r.Header.Get("back")
	setIDStr := r.Header.Get("set_id")
	userIDStr := r.Header.Get("user_id")
	if front == "" || back == "" || setIDStr == "" || userIDStr == "" {
		http.Error(w, "missing required headers", http.StatusBadRequest)
		return
	}

	setID, err := strconv.Atoi(setIDStr)
	if err != nil {
		http.Error(w, "Invalid 'set_id' header", http.StatusBadRequest)
		return
	}
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
		return
	}

	setIDInt := int32(setID)
	userIDInt := int32(userID)

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.CreateFlashCard(ctx, db.CreateFlashCardParams{
		Front:  front,
		Back:   back,
		SetID:  setIDInt,
		UserID: userIDInt,
	})
	if error != nil {
		log.Printf("error creating flashcard in db: %v", err)
		http.Error(w, "Failed to create flashcard", http.StatusInternalServerError)
		return
	}
	log.Println("Flashcard created successfully")
}

func (cfg *Config) GetFlashCard(w http.ResponseWriter, r *http.Request) {
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

func (cfg *Config) UpdateFlashCard(w http.ResponseWriter, r *http.Request) {
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

func (cfg *Config) DeleteFlashCard(w http.ResponseWriter, r *http.Request) {
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

func (cfg *Config) DeleteFlashCardSets(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/flashcard_sets/1 -H "user_id: 11"

	// Get set ID from URL parameter
	setIDStr := chi.URLParam(r, "id")
	if setIDStr == "" {
		http.Error(w, "missing set ID in URL", http.StatusBadRequest)
		return
	}

	setID, err := strconv.Atoi(setIDStr)
	if err != nil {
		http.Error(w, "Invalid set ID", http.StatusBadRequest)
		return
	}

	// Get user ID from header
	userIDStr := r.Header.Get("user_id")
	if userIDStr == "" {
		http.Error(w, "missing 'user_id' header", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Printf("could not connect to db: %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	// Delete the flashcard set
	err = query.DeleteFlashCardSet(ctx, db.DeleteFlashCardSetParams{
		ID:     int32(setID),
		UserID: int32(userID),
	})
	if err != nil {
		log.Printf("error deleting flashcard set: %v", err)
		http.Error(w, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Flashcard set deleted successfully\n"))
}
