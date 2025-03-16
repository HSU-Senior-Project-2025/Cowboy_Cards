package controllers

import (
	"context"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) ListUsers(w http.ResponseWriter, r *http.Request) {
	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}

	users, err := query.ListUsers(ctx)
	if err != nil {
		logAndSendError(w, err, "Error getting users from DB", http.StatusInternalServerError)
		return
	}

	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// GetUser handles retrieving user information
func (h *Handler) GetUserById(w http.ResponseWriter, r *http.Request) {
	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := ctx.Value(middleware.UserIdKey).(int32)
	if !ok {
		logAndSendError(w, err, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := query.GetUserById(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "User not found", http.StatusNotFound)
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

	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// UpdateUser handles updating user information
func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logAndSendError(w, err, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Username == "" || req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		logAndSendError(w, errors.New("empty fields submitted"), "All fields are required", http.StatusBadRequest)
		return
	}

	// *************
	// needs more validation here
	// usual min pw len: 8, bcrypt max: 72 bytes
	// *************

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		logAndSendError(w, err, "Error hashing password", http.StatusInternalServerError)
		return
	}

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := ctx.Value(middleware.UserIdKey).(int32)
	if !ok {
		logAndSendError(w, err, "Unauthorized", http.StatusUnauthorized)
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
