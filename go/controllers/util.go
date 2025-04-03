package controllers

import (
	"context"
	"net/http"
	"os"
	"strconv"
	"time"

	"aidanwoods.dev/go-paseto"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Embed struct {
	middleware.Handler
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

func logAndSendError(w http.ResponseWriter, err error, msg string, statusCode int) {
	middleware.LogAndSendError(w, err, msg, statusCode)
}

func getInt32Id(val string) (id int32, err error) {
	return middleware.GetInt32Id(val)
}

func getHeaderVals(r *http.Request, headers ...string) (map[string]string, error) {
	return middleware.GetHeaderVals(r, headers...)
}

func getQueryConnAndContext(r *http.Request, h *Embed) (query *db.Queries, ctx context.Context, conn *pgxpool.Conn, err error) {
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
		pasetoAud = os.Getenv("PASETO_AUD")
		pasetoIss = os.Getenv("PASETO_ISS")
		pasetoKey = os.Getenv("PASETO_SECRET")
		pasetoImp = os.Getenv("PASETO_IMPLICIT")
	)

	token := paseto.NewToken()

	token.SetAudience(pasetoAud)
	token.SetJti(uuid.New().String())
	token.SetIssuer(pasetoIss)
	token.SetSubject(strconv.Itoa(int(user.ID)))
	token.SetExpiration(time.Now().Add(time.Minute))
	token.SetNotBefore(time.Now().Add(-3 * time.Second))
	token.SetIssuedAt(time.Now())

	secretKey, err := paseto.V4SymmetricKeyFromHex(pasetoKey)
	if err != nil {
		return AuthResponse{}, err
	}
	signed := token.V4Encrypt(secretKey, []byte(pasetoImp))

	response = AuthResponse{
		Token:     signed,
		UserID:    user.ID,
		Username:  user.Username,
		Email:     user.Email,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}

	return
}

// keygen:
// key := make([]byte, num)
// rand.Read(key)
// dst := make([]byte, base64.StdEncoding.EncodedLen(len(key)))
// base64.StdEncoding.Encode(dst, key)
// fmt.Println(string(dst))

// k := paseto.NewV4SymmetricKey()
// fmt.Println(k.ExportHex())
// https://go.dev/play/p/bClzAlvZnnq
