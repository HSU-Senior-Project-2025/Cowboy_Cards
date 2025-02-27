package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
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
	log.Println("data: ", classes)
	log.Println()

	b, err := json.Marshal(classes[0])
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline
}

func (cfg *Config) GetFlashCardSet(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")

	log.Println("idStr: ", idStr)

	// Validate UUID
	_, err := uuid.Parse(idStr)
	if err != nil {
		http.Error(w, "Invalid UUID format", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	id := new(pgtype.UUID)

	err = id.Scan(idStr)
	if err != nil {
		log.Fatalf("Scan error... %v", err)
	}

	flashcard_sets, err := query.GetFlashCardSet(ctx, *id)
	if err != nil {
		log.Fatalf("error getting flash card sets from db... %v", err)
	}
	log.Println("data: ", flashcard_sets)
	log.Println()

	b, err := json.Marshal(flashcard_sets[0])
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline
}

// func (cfg *Config) GetUsers(w http.ResponseWriter, r *http.Request) {
// 	ctx := context.Background()

// 	conn, err := pgx.Connect(ctx, string(cfg.DB))
// 	if err != nil {
// 		log.Fatalf("could not connect to db... %v", err)
// 	}
// 	defer conn.Close(ctx)

// 	query := db.New(conn)

// 	users, err := query.GetUsers(ctx)
// 	if err != nil {
// 		log.Fatalf("error getting users from db... %v", err)
// 	}
// 	log.Println(users)
// 	log.Println()

// }

// func (cfg *Config) GetUser(w http.ResponseWriter, r *http.Request) {
// 	ctx := context.Background()

// 	conn, err := pgx.Connect(ctx, string(cfg.DB))
// 	if err != nil {
// 		log.Fatalf("could not connect to db... %v", err)
// 	}
// 	defer conn.Close(ctx)

// 	query := db.New(conn)

// 	log.Println(&r)

// 	user, err := query.GetUser(ctx, 2)
// 	if err != nil {
// 		log.Fatalf("error getting user from db... %v", err)
// 	}
// 	log.Println(user)
// 	log.Println()

// }
