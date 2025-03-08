package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// User represents the user data that will be sent to the client
type User struct {
	ID        int32     `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// SignupRequest represents the signup request body
type SignupRequest struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

// UpdateUserRequest represents the update user request body
type UpdateUserRequest struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

// AuthResponse represents the response sent after successful authentication
type AuthResponse struct {
	Token     string `json:"token"`
	UserID    int32  `json:"user_id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Message string `json:"message"`
	Code    string `json:"code"`
}

// Claims structure
type Claims struct {
	UserID int32  `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

// JWT secret key - should be stored in environment variables in production
var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// Login handles user authentication
func (cfg *Config) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	querier := db.New(cfg.DB)

	user, err := querier.GetUserByEmail(ctx, req.Email)
	if err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	claims := &Claims{
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		log.Printf("Error creating JWT token: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := AuthResponse{
		Token:     tokenString,
		UserID:    user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Signup handles user registration
func (cfg *Config) Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Username == "" || req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	ctx := context.Background()
	querier := db.New(cfg.DB)

	// Check if username already exists
	_, err = querier.GetUserByUsername(ctx, req.Username)
	if err == nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		log.Printf("Error checking username: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Check if email already exists
	_, err = querier.GetUserByEmail(ctx, req.Email)
	if err == nil {
		http.Error(w, "Email already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		log.Printf("Error checking email: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	params := db.CreateUserParams{
		Username:  req.Username,
		Email:     req.Email,
		Password:  string(hashedPassword),
		FirstName: req.FirstName,
		LastName:  req.LastName,
	}

	user, err := querier.CreateUser(ctx, params)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	claims := &Claims{
		UserID: user.ID,
		Email:  user.Email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		log.Printf("Error creating JWT token: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := AuthResponse{
		Token:     tokenString,
		UserID:    user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetUser handles retrieving user information
func (cfg *Config) GetUser(w http.ResponseWriter, r *http.Request) {
	// Get user_id from context (set by AuthMiddleware)
	userID, ok := r.Context().Value("user_id").(int32)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx := context.Background()
	querier := db.New(cfg.DB)

	user, err := querier.GetUserByID(ctx, userID)
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
func (cfg *Config) UpdateUser(w http.ResponseWriter, r *http.Request) {
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
	conn, err := cfg.DB.Acquire(ctx)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	querier := db.New(conn)

	// Check if username is taken (by another user)
	existingUser, err := querier.GetUserByUsername(ctx, req.Username)
	if err == nil && existingUser.ID != userID {
		http.Error(w, "Username already taken", http.StatusConflict)
		return
	}

	// Check if email is taken (by another user)
	existingUser, err = querier.GetUserByEmail(ctx, req.Email)
	if err == nil && existingUser.ID != userID {
		http.Error(w, "Email already taken", http.StatusConflict)
		return
	}

	// Update user
	err = querier.UpdateUser(ctx, db.UpdateUserParams{
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
	user, err := querier.GetUserByID(ctx, userID)
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
func (cfg *Config) DeleteUser(w http.ResponseWriter, r *http.Request) {
	// Get user_id from context (set by AuthMiddleware)
	userID, ok := r.Context().Value("user_id").(int32)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx := context.Background()
	querier := db.New(cfg.DB)

	err := querier.DeleteUser(ctx, userID)
	if err != nil {
		log.Printf("Error deleting user: %v", err)
		http.Error(w, "Error deleting user", http.StatusInternalServerError)
		return
	}

	// Return success with no content
	w.WriteHeader(http.StatusNoContent)
}

// AuthMiddleware handles authentication for incoming requests
func (cfg *Config) AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing authorization header", http.StatusUnauthorized)
			return
		}

		// Check for Bearer prefix
		const bearerPrefix = "Bearer "
		if !strings.HasPrefix(authHeader, bearerPrefix) {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		// Extract the token
		tokenString := strings.TrimPrefix(authHeader, bearerPrefix)

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "user_id", claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
