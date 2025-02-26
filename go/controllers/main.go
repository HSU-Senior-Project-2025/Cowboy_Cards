package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
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
	log.Println("data: ", classes)
	log.Println()

	b, err := json.Marshal(classes[0])
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
