package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"golang.org/x/crypto/bcrypt"
)

// Login handles user authentication
func (h *Embed) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logAndSendError(w, err, "Invalid request body", http.StatusBadRequest)
		return
	}

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	user, err := query.GetUserByEmail(ctx, req.Email)
	if err != nil {
		logAndSendError(w, err, "Invalid email", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		logAndSendError(w, err, "Invalid password", http.StatusUnauthorized)
		return
	}

	resp, err := getTokenAndResponse(user)
	if err != nil {
		logAndSendError(w, err, "Error creating token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// Signup handles user registration
func (h *Embed) Signup(w http.ResponseWriter, r *http.Request) {
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

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Check if username already exists
	_, err = query.GetUserByUsername(ctx, req.Username)
	if err == nil {
		logAndSendError(w, err, "Username already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		logAndSendError(w, err, "Error checking username", http.StatusInternalServerError)
		return
	}

	// Check if email already exists
	_, err = query.GetUserByEmail(ctx, req.Email)
	if err == nil {
		logAndSendError(w, err, "Email already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		logAndSendError(w, err, "Error checking email", http.StatusInternalServerError)
		return
	}

	params := db.CreateUserParams{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}

	user, err := query.CreateUser(ctx, params)
	if err != nil {
		logAndSendError(w, err, "Failed to create user", http.StatusInternalServerError)
		return
	}

	resp, err := getTokenAndResponse(user)
	if err != nil {
		logAndSendError(w, err, "Error creating token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}
