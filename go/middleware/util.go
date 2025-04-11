package middleware

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"slices"
	"strconv"
	"strings"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	DB *pgxpool.Pool
}

type userIDKey string
type classIDKey string
type flashcardIDKey string
type setIDKey string
type userRoleKey string

const (
	userKey      userIDKey      = "userID"
	classKey     classIDKey     = "classID"
	flashcardKey flashcardIDKey = "flashcardID"
	setKey       setIDKey       = "setID"
	roleKey      userRoleKey    = "userRole"
	sessionName  string         = "cowboy-cards-session"
)

func LogAndSendError(w http.ResponseWriter, err error, msg string, statusCode int) {
	log.Printf(msg+": %v", err)
	http.Error(w, msg, statusCode)
}

func GetUserIDFromContext(ctx context.Context) (id int32, ok bool) {
	id, ok = ctx.Value(userKey).(int32)
	return
}

func GetClassIDFromContext(ctx context.Context) (id int32, ok bool) {
	id, ok = ctx.Value(classKey).(int32)
	return
}

func GetFlashcardIDFromContext(ctx context.Context) (id int32, ok bool) {
	id, ok = ctx.Value(flashcardKey).(int32)
	return
}

func GetSetIDFromContext(ctx context.Context) (id int32, ok bool) {
	id, ok = ctx.Value(setKey).(int32)
	return
}

func GetRoleFromContext(ctx context.Context) (role string, ok bool) {
	role, ok = ctx.Value(roleKey).(string)
	return
}

func GetInt32Id(val string) (id int32, err error) {
	idInt, err := strconv.Atoi(val)
	if err != nil {
		return 0, err
	}
	if idInt < 1 {
		return 0, errors.New("invalid id")
	}

	id = int32(idInt)

	return
}

func GetHeaderVals(r *http.Request, headers ...string) (map[string]string, error) {
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

func GetQueryConnAndContext(r *http.Request, h *Handler) (query *db.Queries, ctx context.Context, conn *pgxpool.Conn, err error) {
	ctx = r.Context()

	conn, err = h.DB.Acquire(ctx)
	if err != nil {
		return nil, nil, nil, err
	}

	query = db.New(conn)

	return
}
