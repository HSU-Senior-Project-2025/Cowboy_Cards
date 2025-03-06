package controllers

import (
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

// Config struct to hold dependencies
type Config struct {
	DB      *pgxpool.Pool
	Querier *db.Queries
}