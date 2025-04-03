package middleware

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

	"aidanwoods.dev/go-paseto"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
)

type userIdKey string

type Handler struct {
	DB *pgxpool.Pool
}

const userKey userIdKey = "userId"

var (
	pasetoAud = os.Getenv("PASETO_AUD")
	pasetoIss = os.Getenv("PASETO_ISS")
	pasetoKey = os.Getenv("PASETO_SECRET")
	pasetoImp = os.Getenv("PASETO_IMPLICIT")
	Cors      = cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173", "http://localhost:8080", "http://localhost:8100", "http://localhost:8000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		Debug:            false,
		MaxAge:           300,
	})
)

func LogAndSendError(w http.ResponseWriter, err error, msg string, statusCode int) {
	log.Printf(msg+": %v", err)
	http.Error(w, msg, statusCode)
}

func SetCacheControlHeader(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	str := ""

	if path.Clean(r.URL.Path) == "/" || strings.Contains(path.Clean(r.URL.Path), "/api/") {
		str = "no-cache, no-store, must-revalidate"
	} else {
		str = "public, max-age=31536000, immutable"
	}

	w.Header().Set("Cache-Control", str)
	next(w, r)
}

func FromContext(ctx context.Context) (id int32, ok bool) {
	id, ok = ctx.Value(userKey).(int32)
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

func Auth(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {

	// ****************************
	// get token from cookie here
	token := "h"
	// ****************************

	parser := paseto.NewParser()
	parser.AddRule(paseto.ForAudience(pasetoAud))
	// parser.AddRule(paseto.IdentifiedBy("identifier")) possible later use
	parser.AddRule(paseto.IssuedBy(pasetoIss))
	parser.AddRule(paseto.NotBeforeNbf())
	parser.AddRule(paseto.NotExpired())
	// parser.AddRule(paseto.Subject("subject"))
	parser.AddRule(paseto.ValidAt(time.Now()))

	secretKey, err := paseto.V4SymmetricKeyFromHex(pasetoKey)
	if err != nil {
		LogAndSendError(w, err, "Key parse error", http.StatusBadRequest)
		return
	}

	parsedToken, err := parser.ParseV4Local(secretKey, token, []byte(pasetoImp))
	if err != nil {
		LogAndSendError(w, err, "Token parse error", http.StatusBadRequest)
	}

	subj, err := parsedToken.GetSubject()
	if err != nil {
		LogAndSendError(w, err, "Subject not found or not a string", http.StatusBadRequest)
	}

	ctx := context.WithValue(r.Context(), userKey, subj)
	next(w, r.WithContext(ctx))
}

func (h *Handler) VerifyTeacherMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		query, ctx, conn, err := GetQueryConnAndContext(r, h)
		if err != nil {
			LogAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
			return
		}
		defer conn.Release()
		// Get user_id from context (set by AuthMiddleware)
		// id, ok := FromContext(ctx)
		// if !ok {
		// 	LogAndSendError(w, err, "Unauthorized", http.StatusUnauthorized)
		// 	return
		// }

		headerVals, err := GetHeaderVals(r, "id", "user_id")
		if err != nil {
			LogAndSendError(w, err, "Header error", http.StatusBadRequest)
			return
		}

		id, err := GetInt32Id(headerVals["user_id"])
		if err != nil {
			LogAndSendError(w, err, "Invalid id", http.StatusBadRequest)
			return
		}

		cid, err := GetInt32Id(headerVals["id"])
		if err != nil {
			LogAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
			return
		}

		teacher, err := query.VerifyTeacher(ctx, db.VerifyTeacherParams{
			ClassID: cid,
			UserID:  id,
		})
		log.Println("teacher", teacher)

		if err != nil {
			LogAndSendError(w, err, "Invalid permissions", http.StatusInternalServerError)
			return
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
