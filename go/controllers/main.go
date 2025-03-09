package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Config struct {
	DB *pgxpool.Config
}

/* GetClasses retrieves all classes from the database and returns them as a JSON response */
func (cfg *Config) GetClasses(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	query := db.New(conn)

	classes, err := query.GetClasses(ctx)
	if err != nil {
		log.Printf("error getting classes from db... %v", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(classes); err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func (cfg *Config) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	query := db.New(conn)

	users, err := query.GetUsers(ctx)
	if err != nil {
		log.Printf("error getting users from db... %v", err)
		http.Error(w, "Failed to get users", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
