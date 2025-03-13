package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

func (h *Handler) GetUsers(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	conn, err := pool.DB.Acquire(ctx)
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

// GetUser handles retrieving user information
func (h *Handler) GetUser(w http.ResponseWriter, r *http.Request) {
	// Get user_id from context (set by AuthMiddleware)
	userID, ok := r.Context().Value("user_id").(int32)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx := context.Background()
	query := db.New(pool.DB)

	user, err := query.GetUserByID(ctx, userID)
	if err != nil {
		log.Printf("Error getting user: %v", err)
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	// Convert to response type to avoid sending sensitive information
	response := User{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		CreatedAt: user.CreatedAt.Time,
		UpdatedAt: user.UpdatedAt.Time,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateUser handles updating user information
func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	// Get user_id from context (set by AuthMiddleware)
	userID, ok := r.Context().Value("user_id").(int32)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Username == "" || req.Email == "" {
		http.Error(w, "Username and email are required", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	conn, err := pool.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	query := db.New(conn)

	// Check if username is taken (by another user)
	existingUser, err := query.GetUserByUsername(ctx, req.Username)
	if err == nil && existingUser.ID != userID {
		http.Error(w, "Username already taken", http.StatusConflict)
		return
	}

	// Check if email is taken (by another user)
	existingUser, err = query.GetUserByEmail(ctx, req.Email)
	if err == nil && existingUser.ID != userID {
		http.Error(w, "Email already taken", http.StatusConflict)
		return
	}

	// Update user
	err = query.UpdateUser(ctx, db.UpdateUserParams{
		Username:  req.Username,
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		ID:        userID,
	})
	if err != nil {
		log.Printf("error updating user: %v", err)
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	// Get updated user info
	user, err := query.GetUserByID(ctx, userID)
	if err != nil {
		log.Printf("error getting updated user: %v", err)
		http.Error(w, "Failed to get updated user info", http.StatusInternalServerError)
		return
	}

	// Convert to response type
	response := User{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		CreatedAt: user.CreatedAt.Time,
		UpdatedAt: user.UpdatedAt.Time,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteUser handles user account deletion
func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	// Get user_id from context (set by AuthMiddleware)
	userID, ok := r.Context().Value("user_id").(int32)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx := context.Background()
	query := db.New(pool.DB)

	err := query.DeleteUser(ctx, userID)
	if err != nil {
		log.Printf("Error deleting user: %v", err)
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}

	// Return success with no content
	w.WriteHeader(http.StatusNoContent)
}
