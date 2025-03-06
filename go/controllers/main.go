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
	"github.com/jackc/pgx/v5/pgtype"
)

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

	querier := db.New(conn)

	classes, err := querier.GetClasses(ctx)
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

//		return
//	}

	//ctx := context.Background()

	//conn, err := cfg.DB.Acquire(ctx)
//	if err != nil {
	//	log.Printf("could not connect to db... %v", err)
	//	http.Error(w, "Database connection error", http.StatusInternalServerError)

		return
	}
	defer conn.Release()


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

//	querier := db.New(conn)

	//err = querier.CreateFlashCardSet(ctx, db.CreateFlashCardSetParams{
	//	Name:        name,
	//	Description: description,
	//})
	//if err != nil {
	//	log.Printf("error creating flashcard set in db: %v", err)
	//	http.Error(w, "Failed to create flashcard set", http.StatusInternalServerError)

		return
	}
	w.WriteHeader(http.StatusCreated)
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
		log.Printf("error parsing id: %v", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()
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

//	flashcard_set, err := query.GetFlashCardSet(ctx, int32(id))
//	if err != nil {
//		log.Printf("error getting flash card set from db: %v", err)
//		http.Error(w, "Failed to get flashcard set", http.StatusInternalServerError)
//		return
//	}
//	log.Println("data: ", flashcard_set)
//	log.Println()
//	b, err := json.Marshal(flashcard_set)

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

	//w.Write(append(b, 10)) //add newline

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
		log.Printf("error parsing id: %v", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)

	err = querier.UpdateFlashCardSet(ctx, db.UpdateFlashCardSetParams{
		ID:          int32(id),
		Name:        name,
		Description: description,
	})
	if err != nil {
		log.Printf("error updating flashcard set in db: %v", err)
		http.Error(w, "Failed to update flashcard set", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
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
		log.Printf("error parsing id: %v", err)
		http.Error(w, "Invalid 'id' header", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)

	err = querier.DeleteFlashCardSet(ctx, int32(id))
	if err != nil {
		log.Printf("error deleting flashcard set from db: %v", err)
		http.Error(w, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	log.Println("Flashcard set deleted successfully")

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

/* CreateFlashCard creates a new flash card in the database */
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
		log.Printf("error parsing set_id: %v", err)
		http.Error(w, "Invalid 'set_id' header", http.StatusBadRequest)
		return
	}


	setIDInt := int32(setID)


	//ctx := context.Background()

	//conn, err := cfg.DB.Acquire(ctx)
	//if err != nil {
	//	log.Printf("could not connect to db... %v", err)
	//	http.Error(w, "Database connection error", http.StatusInternalServerError)
	//	return
	//}
	//defer conn.Release()

	//querier := db.New(conn)

//	err = querier.CreateFlashCard(ctx, db.CreateFlashCardParams{
	//	Front: front,
		//Back:  back,
	//	SetID: int32(setID),
	//})
	//if err != nil {
	//	log.Printf("error creating flash card: %v", err)
	//	http.Error(w, "Failed to create flash card", http.StatusInternalServerError)
	//	return
	//}
	//w.WriteHeader(http.StatusCreated)
//}


/* GetFlashCard retrieves a flash card by ID */
func (cfg *Config) GetFlashCard(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid flash card ID", http.StatusBadRequest)
		return
	}

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)


	error := query.CreateFlashCard(ctx, db.CreateFlashCardParams{
		Front: front,
		Back:  back,
		SetID: setIDInt,
	})
	if error != nil {
		log.Printf("error creating flashcard in db: %v", err)
		http.Error(w, "Failed to create flashcard", http.StatusInternalServerError)

//	flashcard, err := querier.GetFlashCard(ctx, int32(id))
//	if err != nil {
//		if err == pgx.ErrNoRows {
//			http.Error(w, "Flash card not found", http.StatusNotFound)
//			return
//		}
//		log.Printf("error getting flash card: %v", err)
//		http.Error(w, "Database error", http.StatusInternalServerError)

		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(flashcard)
}

/* UpdateFlashCard updates a flash card's content */
func (cfg *Config) UpdateFlashCard(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid flash card ID", http.StatusBadRequest)
		return
	}

	front := r.Header.Get("front")
	back := r.Header.Get("back")
	if front == "" || back == "" {
		http.Error(w, "missing required headers", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)

	err = querier.UpdateFlashCard(ctx, db.UpdateFlashCardParams{
		Front: front,
		Back:  back,
		ID:    int32(id),
	})
	if err != nil {
		log.Printf("error updating flash card: %v", err)
		http.Error(w, "Error updating flash card", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

/* DeleteFlashCard deletes a flash card */
func (cfg *Config) DeleteFlashCard(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid flash card ID", http.StatusBadRequest)
		return
	}

	ctx := context.Background()

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)

	err = querier.DeleteFlashCard(ctx, int32(id))
	if err != nil {
		log.Printf("error deleting flash card: %v", err)
		http.Error(w, "Error deleting flash card", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
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

	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db: %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)

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

func (cfg *Config) DeleteFlashCardSets(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/flashcard_sets/1 -H "id: 1"

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
	err = query.DeleteFlashCardSet(ctx, int32(setID))
	
	if err != nil {
		log.Printf("error deleting flashcard set: %v", err)
		http.Error(w, "Failed to delete flashcard set", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Flashcard set deleted successfully\n"))
}

func (cfg *Config) CreateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/class -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	name := r.Header.Get("name");
	if name == "" {
		http.Error(w, "No class name given", http.StatusBadRequest);
		return
	}

	description := r.Header.Get("description");
	if description == "" {
		http.Error(w, "No class description given", http.StatusBadRequest);
		return
	}

	joincode := r.Header.Get("joincode");
	if joincode == "" {
		http.Error(w, "No class join code given", http.StatusBadRequest);
		return
	}

	idStr := r.Header.Get("teacherid");
	if idStr == "" {
		http.Error(w, "No teacher id given", http.StatusBadRequest);
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.CreateClass(ctx, db.CreateClassParams{
		Name: name,
		Description: description,
		JoinCode: joincode,
		TeacherID: id,
	})

	if error != nil {
		log.Printf("Error creating class in db: %v", err)
		http.Error(w, "Failed to create class", http.StatusInternalServerError)
		return
	}
	log.Println("Class created successfully")
}

func (cfg *Config) GetClass(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/class -H "id: 1"

	idStr := r.Header.Get("id");
	if idStr == "" {
		http.Error(w, "No class id given", http.StatusBadRequest);
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
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

func (cfg *Config) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/class -H "id: 1" -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	cIdStr := r.Header.Get("id")
	if cIdStr == "" {
		http.Error(w, "No class id given", http.StatusBadRequest)
		return;
	}

	cId, err := strconv.Atoi(cIdStr)
	if err != nil {
		http.Error(w, "Invalid class id", http.StatusBadRequest)
		return
	}

	cId32:= int32(cId)
	if cId32 == 0 {
		http.Error(w, "Invalid class id", http.StatusBadRequest)
		return
	}

	name := r.Header.Get("name");
	if name == "" {
		http.Error(w, "No class name given", http.StatusBadRequest);
		return
	}

	description := r.Header.Get("description");
	if description == "" {
		http.Error(w, "No class description given", http.StatusBadRequest);
		return
	}

	joincode := r.Header.Get("joincode");
	if joincode == "" {
		http.Error(w, "No class join code given", http.StatusBadRequest);
		return
	}

	tIdStr := r.Header.Get("teacherid");
	if tIdStr == "" {
		http.Error(w, "No teacher id given", http.StatusBadRequest);
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

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.UpdateClass(ctx, db.UpdateClassParams{
		Name: name,
		Description: description,
		JoinCode: joincode,
		TeacherID: tId,
		ID: cId32,
	})

	if error != nil {
		log.Printf("Error updating class in db: %v", err)
		http.Error(w, "Failed to update class", http.StatusInternalServerError)
		return
	}
	log.Println("Class updated successfully")
}

func (cfg *Config) DeleteClass(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/class -H "id: 1"

	idStr := r.Header.Get("id")

	if idStr == "" {
		http.Error(w, "No class id given", http.StatusBadRequest)
		return;
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid class id given", http.StatusBadRequest)
		return;
	}

	classId := int32(id);

	ctx := context.Background()

	conn, err := pgx.ConnectConfig(ctx, cfg.DB)
	if err != nil {
		log.Fatalf("Could not connect to db... %v", err)
	}
	defer conn.Close(ctx)

	query := db.New(conn)

	error := query.DeleteClass(ctx, classId)

	if error != nil {
		log.Printf("Error deleting class in db: %v", error)
		http.Error(w, "Failed to delete class", http.StatusInternalServerError)
		return;
	}
	log.Println("Class deleted successfully")
}