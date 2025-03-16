package controllers

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"slices"
	"strconv"
	"strings"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	DB *pgxpool.Pool
}

// User represents the user data that will be sent to the client
type User struct {
	ID        int32     `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
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

type updateHeaderVal struct {
	id      int32
	col     string
	val     string
	numeric bool
	err     error
}

func getRowId(r *http.Request) (id int32, err error) {
	idStr := r.Header.Get("id")
	if idStr == "" {
		err = errors.New("id header missing")
		return
	}

	idInt, err := strconv.Atoi(idStr)
	if err != nil || idInt < 1 {
		err = errors.Join(err, errors.New("invalid id"))
		return
	}

	id = int32(idInt)

	return
}

func getCreateHeaderVals(r *http.Request, headers []string) (map[string]string, error) {
	reqHeaders := r.Header
	vals := map[string]string{}

	for k := range reqHeaders {
		lower := strings.ToLower(k)
		if slices.Contains(headers, lower) {
			val := reqHeaders.Get(k)
			if val == "" {
				return nil, fmt.Errorf("%v header missing", k)
			}
			vals[lower] = val
		}
	}
	if len(vals) != len(headers) {
		return nil, errors.New("header(s) missing")
	}

	return vals, nil
}

func getUpdateHeaderVal(r *http.Request) (u updateHeaderVal) {
	u.id, u.err = getRowId(r)
	if u.err != nil {
		return
	}

	u.col = path.Base(r.URL.Path)

	u.val = r.Header.Get(u.col)
	if u.val == "" {
		u.err = errors.New("column header missing")
		return
	}

	u.numeric = strings.HasSuffix(u.col, "Id")

	return
}

func logAndSendError(w http.ResponseWriter, err error, msg string, statusCode int) {
	log.Printf(msg+": %v", err)
	http.Error(w, msg, statusCode)
}

func getQueryConnAndContext(r *http.Request, h *Handler) (query *db.Queries, ctx context.Context, conn *pgxpool.Conn, err error) {
	ctx = r.Context()

	conn, err = h.DB.Acquire(ctx)
	if err != nil {
		return nil, nil, nil, err
	}

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
