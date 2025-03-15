package controllers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type Handler struct {
	DB *pgxpool.Pool
}

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

type ZeroRowSuccessResponse struct {
	Resp string `json:"resp"`
}

// ErrorResponse represents an error response
// type ErrorResponse struct {
// 	Message string `json:"message"`
// 	Code    string `json:"code"`
// }

// no need for custom claims rn imo

func logAndSendError(w http.ResponseWriter, err error, msg string, statusCode int) {
	log.Printf(msg+": %v", err)
	http.Error(w, msg, statusCode)
}

func getQueryAndContext(r *http.Request, h *Handler) (query *db.Queries, ctx context.Context, err error) {
	ctx = r.Context()

	log.Println("context: ", ctx)

	conn, err := h.DB.Acquire(ctx)
	if err != nil {
		return nil, nil, err
	}
	defer conn.Release()

	query = db.New(conn)

	return
}

func getTokenAndResponse(user db.User) (response AuthResponse, err error) {
	var (
		jwtAud = os.Getenv("JWT_AUD")
		jwtIss = os.Getenv("JWT_ISS")
		jwtKey = os.Getenv("JWT_SECRET")
	)

	registeredClaims := jwt.RegisteredClaims{
		Issuer:    jwtIss,
		Subject:   strconv.Itoa(int(user.ID)),
		Audience:  jwt.ClaimStrings{jwtAud},
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(2 * time.Hour)),     //should be as short as possible
		NotBefore: jwt.NewNumericDate(time.Now().Add(-30 * time.Second)), //recommended 30 seconds for clock skew
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		ID:        uuid.New().String(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, registeredClaims)
	tokenString, err := token.SignedString([]byte(jwtKey))
	if err != nil {
		log.Printf("Error creating JWT token: %v", err)
		return AuthResponse{}, err
	}

	response = AuthResponse{
		Token:     tokenString,
		UserID:    user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	return
}

// Login handles user authentication
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error in req body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	user, err := query.GetUserByEmail(ctx, req.Email)
	if err != nil {
		log.Printf("Error checking email: %v", err)
		http.Error(w, "Invalid email", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		log.Printf("Error checking password: %v", err)
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	resp, err := getTokenAndResponse(user)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

// Signup handles user registration
func (h *Handler) Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error in req body: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.Username == "" || req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// *************
	// needs more validation here
	// usual min pw len: 8, bcrypt max: 72 bytes
	// *************

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	query, ctx, err := getQueryAndContext(r, h)
	if err != nil {
		log.Printf("could not connect to db... %v", err)
		http.Error(w, "Database connection error", http.StatusInternalServerError)
		return
	}

	// Check if username already exists
	//if user value is never used and we just need the error, change sqlc query annotation from 'one'
	_, err = query.GetUserByUsername(ctx, req.Username)
	if err == nil {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	} else if !strings.Contains(err.Error(), "no rows") {
		log.Printf("Error checking username: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Check if email already exists
	_, err = query.GetUserByEmail(ctx, req.Email)
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

	user, err := query.CreateUser(ctx, params)
	if err != nil {
		log.Printf("Error creating user: %v", err)
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	resp, err := getTokenAndResponse(user)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	// w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}
