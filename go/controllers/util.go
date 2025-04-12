package controllers

import (
	"context"
	"errors"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
)

// wraps mw handler that wraps db pool
type DBHandler struct {
	middleware.Handler
}

// User represents the user data that will be sent to the client
type User struct {
	// ID        int32
	Username  string
	Email     string
	FirstName string
	LastName  string
	CreatedAt string
	// UpdatedAt time.Time
	NumClasses int
}

// Class represents the class data that will be sent to the client in a getclassbyid req
type Class struct {
	ID               int32
	ClassName        string
	ClassDescription string
	CreatedAt        string
	UpdatedAt        string
	Role             string
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string
	Password string
}

// SignupRequest represents the signup request body
type SignupRequest struct {
	Username  string
	Email     string
	Password  string
	FirstName string
	LastName  string
}

var errContext error = errors.New("error retrieving from context")

const (
	back              string = "back"
	card_id           string = "card_id"
	class_description string = "class_description"
	class_id          string = "class_id"
	class_name        string = "class_name"
	correct           string = "correct"
	email             string = "email"
	first_name        string = "first_name"
	front             string = "front"
	id                string = "id"
	incorrect         string = "incorrect"
	last_name         string = "last_name"
	owner             string = "owner"
	password          string = "password"
	roleStr           string = "role"
	set_description   string = "set_description"
	set_id            string = "set_id"
	set_name          string = "set_name"
	student_id        string = "student_id"
	teacher           string = "teacher"
	username          string = "username"
)

func logAndSendError(w http.ResponseWriter, err error, msg string, statusCode int) {
	middleware.LogAndSendError(w, err, msg, statusCode)
}

func getInt32Id(val string) (id int32, err error) {
	return middleware.GetInt32Id(val)
}

func getHeaderVals(r *http.Request, headers ...string) (map[string]string, error) {
	return middleware.GetHeaderVals(r, headers...)
}

func getQueryConnAndContext(r *http.Request, h *DBHandler) (query *db.Queries, ctx context.Context, conn *pgxpool.Conn, err error) {
	ctx = r.Context()

	conn, err = h.DB.Acquire(ctx)
	if err != nil {
		return nil, nil, nil, err
	}

	query = db.New(conn)

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
