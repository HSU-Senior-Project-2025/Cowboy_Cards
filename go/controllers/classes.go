package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Pool struct {
	DB *pgxpool.Pool
}

/* GetClasses retrieves all classes from the database and returns them as a JSON response */
func (pool *Pool) GetClasses(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	conn, err := pool.DB.Acquire(ctx)
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

func (pool *Pool) CreateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/class -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	name := r.Header.Get("name")
	if name == "" {
		http.Error(w, "No class name given", http.StatusBadRequest)
		return
	}

	description := r.Header.Get("description")
	if description == "" {
		http.Error(w, "No class description given", http.StatusBadRequest)
		return
	}

	joincode := r.Header.Get("joincode")
	if joincode == "" {
		http.Error(w, "No class join code given", http.StatusBadRequest)
		return
	}

	idStr := r.Header.Get("teacherid")
	if idStr == "" {
		http.Error(w, "No teacher id given", http.StatusBadRequest)
		return
	}

	teacherId, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "invalid teacher id", http.StatusBadRequest)
		return
	}

	id := pgtype.Int4{Int32: int32(teacherId), Valid: true}
	if id.Int32 == 0 {
		http.Error(w, "invalid teacher id", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.CreateClass(ctx, db.CreateClassParams{
		Name:        name,
		Description: description,
		JoinCode:    joincode,
		TeacherID:   id,
	})

	if error != nil {
		log.Printf("Error creating class in db: %v", err)
		http.Error(w, "Failed to create class", http.StatusInternalServerError)
		return
	}
	log.Println("Class created successfully")
}

func (pool *Pool) GetClass(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/class -H "id: 1"

	idStr := r.Header.Get("id")
	if idStr == "" {
		http.Error(w, "No class id given", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "invalid class id", http.StatusBadRequest)
		return
	}

	classId := int32(id)
	if classId == 0 {
		http.Error(w, "invalid class id", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	class, error := query.GetClass(ctx, classId)

	if error != nil {
		log.Printf("Error getting class in db: %v", err)
		http.Error(w, "Failed to get class", http.StatusInternalServerError)
		return
	}
	log.Println("Class retrieved successfully")
	log.Println("data: ", class)
	log.Println()

	b, err := json.Marshal(class)
	if err != nil {
		log.Println("error:", err)
	}

	w.Write(append(b, 10)) //add newline
}

func (pool *Pool) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/class -H "id: 1" -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	cIdStr := r.Header.Get("id")
	if cIdStr == "" {
		http.Error(w, "No class id given", http.StatusBadRequest)
		return
	}

	cId, err := strconv.Atoi(cIdStr)
	if err != nil {
		http.Error(w, "Invalid class id", http.StatusBadRequest)
		return
	}

	cId32 := int32(cId)
	if cId32 == 0 {
		http.Error(w, "Invalid class id", http.StatusBadRequest)
		return
	}

	name := r.Header.Get("name")
	if name == "" {
		http.Error(w, "No class name given", http.StatusBadRequest)
		return
	}

	description := r.Header.Get("description")
	if description == "" {
		http.Error(w, "No class description given", http.StatusBadRequest)
		return
	}

	joincode := r.Header.Get("joincode")
	if joincode == "" {
		http.Error(w, "No class join code given", http.StatusBadRequest)
		return
	}

	tIdStr := r.Header.Get("teacherid")
	if tIdStr == "" {
		http.Error(w, "No teacher id given", http.StatusBadRequest)
		return
	}

	teacherId, err := strconv.Atoi(tIdStr)
	if err != nil {
		log.Println("error:", err)
		http.Error(w, "invalid teacher id", http.StatusBadRequest)
		return
	}

	tId := pgtype.Int4{Int32: int32(teacherId), Valid: true}
	if tId.Int32 == 0 {
		http.Error(w, "invalid teacher id", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.UpdateClass(ctx, db.UpdateClassParams{
		Name:        name,
		Description: description,
		JoinCode:    joincode,
		TeacherID:   tId,
		ID:          cId32,
	})

	if error != nil {
		log.Printf("Error updating class in db: %v", err)
		http.Error(w, "Failed to update class", http.StatusInternalServerError)
		return
	}
	log.Println("Class updated successfully")
}

func (pool *Pool) DeleteClass(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/class -H "id: 1"

	idStr := r.Header.Get("id")

	if idStr == "" {
		http.Error(w, "No class id given", http.StatusBadRequest)
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid class id given", http.StatusBadRequest)
		return
	}

	classId := int32(id)

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, pool.DB)
	if err != nil {
		log.Fatalf("Could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.DeleteClass(ctx, classId)

	if error != nil {
		log.Printf("Error deleting class in db: %v", error)
		http.Error(w, "Failed to delete class", http.StatusInternalServerError)
		return
	}
	log.Println("Class deleted successfully")
}
