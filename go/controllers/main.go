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

// func (cfg *Config) GetUsersFlashCardSets(w http.ResponseWriter, r *http.Request) {
// 	// curl -X GET localhost:8000/flashcard_sets -H "user_id: 11"

// 	userIDStr := r.Header.Get("user_id")
// 	if userIDStr == "" {
// 		http.Error(w, "missing 'user_id' header", http.StatusBadRequest)
// 		return
// 	}

// 	userID, err := strconv.Atoi(userIDStr)
// 	if err != nil {
// 		log.Println("error:", err)
// 		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
// 		return
// 	}

// 	id := int32(userID)
// 	if id == 0 {
// 		http.Error(w, "Invalid 'user_id' header", http.StatusBadRequest)
// 		return
// 	}

// 	ctx := context.Background()

// 	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
// 	if err != nil {
// 		log.Fatalf("could not connect to db... %v", err)
// 	}
// 	defer conn.Close(ctx)

// 	query := db.New(conn)

// 	flashcard_sets, err := query.GetUsersFlashCardSets(ctx, int32(id))
// 	if err != nil {
// 		log.Fatalf("error getting flash card sets from db... %v", err)
// 	}
// 	log.Println("data: ", flashcard_sets[0])
// 	log.Println()

// 	b, err := json.Marshal(flashcard_sets)
// 	if err != nil {
// 		log.Println("error:", err)
// 	}

// 	w.Write(append(b, 10)) //add newline
// }

func (cfg *Config) CreateFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/flashcard_set -H "name: test" -H "description: test"

	name := r.Header.Get("name")
	description := r.Header.Get("description")
	if name == "" || description == "" {
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

func (cfg *Config) GetFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/flashcard_set -H "id: 1"
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
	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

func (cfg *Config) UpdateFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/flashcard_set -H "id: 1" -H "name: test" -H "description: test"

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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

func (cfg *Config) DeleteFlashCardSet(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/flashcard_set -H "id: 1"

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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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
