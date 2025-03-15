package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgtype"
)

func (h *Handler) ListClasses(w http.ResponseWriter, r *http.Request) {
	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}

	classes, err := query.ListClasses(ctx)
	if err != nil {
		logAndSendError(w, err, "Error getting classes from DB", http.StatusInternalServerError)
		return
	}

	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) CreateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/class -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}

	name := r.Header.Get("name")
	if name == "" {
		logAndSendError(w, err, "No class name header", http.StatusBadRequest)
		return
	}

	description := r.Header.Get("description")
	if description == "" {
		logAndSendError(w, err, "No class description header", http.StatusBadRequest)
		return
	}

	joincode := r.Header.Get("joincode")
	if joincode == "" {
		logAndSendError(w, err, "No class join code header", http.StatusBadRequest)
		return
	}

	idStr := r.Header.Get("teacherid")
	if idStr == "" {
		logAndSendError(w, err, "No teacher id header", http.StatusBadRequest)
		return
	}

	teacherId, err := strconv.Atoi(idStr)
	if err != nil || teacherId == 0 {
		logAndSendError(w, err, "Invalid teacher id", http.StatusBadRequest)
		return
	}

	id := pgtype.Int4{Int32: int32(teacherId), Valid: true}

	err = query.CreateClass(ctx, db.CreateClassParams{
		Name:        name,
		Description: description,
		JoinCode:    joincode,
		TeacherID:   id,
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create class", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(ZeroRowSuccessResponse{Resp: "Class created successfully"}); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) GetClass(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/class -H "id: 1"

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

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

	class, err := query.GetClassById(ctx, classId)
	if err != nil {
		log.Printf("Error getting class in db: %v", err)
		http.Error(w, "Failed to get class", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(class); err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/class -H "id: 1" -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

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

	err = query.UpdateClass(ctx, db.UpdateClassParams{
		Name:        name,
		Description: description,
		JoinCode:    joincode,
		TeacherID:   tId,
		ID:          cId32,
	})
	if err != nil {
		log.Printf("Error updating class in db: %v", err)
		http.Error(w, "Failed to update class", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(ZeroRowSuccessResponse{Resp: "Class updated successfully"}); err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) DeleteClass(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/class -H "id: 1"

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

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

	err = query.DeleteClass(ctx, classId)
	if err != nil {
		log.Printf("Error deleting class in db: %v", err)
		http.Error(w, "Failed to delete class", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	if err := json.NewEncoder(w).Encode(ZeroRowSuccessResponse{Resp: "Class deleted successfully"}); err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}
