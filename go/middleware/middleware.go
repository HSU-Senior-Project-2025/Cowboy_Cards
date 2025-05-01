package middleware

import (
	"context"
	"log"
	"net/http"
	"path"
	"slices"
	"strings"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/rs/cors"
)

var (
	allowList = []string{"https://cowboy-cards.org", "https://cowboy-cards.dsouth.org", "http://localhost:8080", "http://10.84.16.34:8080"} // last one is mobile dev only, should change every time, so check
	Cors      = cors.New(cors.Options{
		AllowedOrigins: allowList,
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
		ExposedHeaders: []string{"Link"},
		// ExposedHeaders:   []string{"Link", "X-CSRF-Token"}, // Expose CSRF token header
		AllowCredentials: true,
		Debug:            false,
		MaxAge:           300,
	})
)

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

func SetCredsHeaders(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	originList, ok := r.Header["Origin"]
	if !ok {
		log.Printf("Origin header not set: %s %s\n", r.Method, r.URL)
	} else {
		origin := originList[0]

		if slices.Contains(allowList, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			log.Printf("disallowed origin: %s not in %s\n", origin, originList)
			LogAndSendError(w, errHeader, "disallowed origin", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Vary", "Origin")
	}

	next(w, r)
}

func (h *Handler) VerifyClassMemberMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("DEBUG: VerifyClassMemberMW called for path: %s", r.URL.Path)

		query, ctx, conn, err := GetQueryConnAndContext(r, h)
		if err != nil {
			LogAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
			return
		}
		defer conn.Release()

		// Get user_id from context (set by AuthMiddleware)
		userID, ok := GetUserIDFromContext(ctx)
		if !ok {
			LogAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var (
			route   = r.URL.Path
			classID int32
		)

		if strings.HasSuffix(route, "/class_set/") || strings.HasSuffix(route, "/class_user/") {
			headerVals, err := GetHeaderVals(r, class_id)
			if err != nil {
				LogAndSendError(w, err, "Header error", http.StatusBadRequest)
				return
			}

			classID, err = GetInt32Id(headerVals[class_id])
			if err != nil {
				LogAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
				return
			}
		} else {
			headerVals, err := GetHeaderVals(r, id)
			if err != nil {
				LogAndSendError(w, err, "Header error", http.StatusBadRequest)
				return
			}

			classID, err = GetInt32Id(headerVals[id])
			if err != nil {
				LogAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
				return
			}
		}

		member, err := query.VerifyClassMember(ctx, db.VerifyClassMemberParams{
			ClassID: classID,
			UserID:  userID,
		})
		if err != nil {
			if strings.Contains(err.Error(), "no rows in result set") {
				ctx = context.WithValue(ctx, roleKey, no_role)
			} else {
				LogAndSendError(w, err, "Invalid permissions", http.StatusUnauthorized)
				return
			}
		} else {
			log.Println("class member: ", member)
			ctx = context.WithValue(ctx, roleKey, member.Role)
		}

		ctx = context.WithValue(ctx, classKey, classID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (h *Handler) VerifySetMemberMW(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("DEBUG: VerifySetMemberMW called for path: %s", r.URL.Path)

		query, ctx, conn, err := GetQueryConnAndContext(r, h)
		if err != nil {
			LogAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
			return
		}
		defer conn.Release()

		// Get user_id from context (set by AuthMiddleware)
		userID, ok := GetUserIDFromContext(ctx)
		if !ok {
			LogAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var (
			method = r.Method
			setID  int32
		)

		if method == http.MethodPost || (method == http.MethodDelete && strings.HasSuffix(r.URL.Path, "/set_user/")) {
			headerVals, err := GetHeaderVals(r, set_id)
			if err != nil {
				LogAndSendError(w, err, "Header error", http.StatusBadRequest)
				return
			}

			setID, err = GetInt32Id(headerVals[set_id])
			if err != nil {
				LogAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
				return
			}
		} else {
			headerVals, err := GetHeaderVals(r, id)
			if err != nil {
				LogAndSendError(w, err, "Header error", http.StatusBadRequest)
				return
			}

			setID, err = GetInt32Id(headerVals[id])
			if err != nil {
				LogAndSendError(w, err, "Invalid set or fc id", http.StatusBadRequest)
				return
			}
		}

		member, err := query.VerifySetMember(ctx, db.VerifySetMemberParams{
			SetID:  setID,
			UserID: userID,
		})
		if err != nil {
			if strings.Contains(err.Error(), "no rows in result set") {
				ctx = context.WithValue(ctx, roleKey, no_role)
			} else {
				LogAndSendError(w, err, "Invalid permissions", http.StatusUnauthorized)
				return
			}
		} else {
			log.Println("set member: ", member)
			ctx = context.WithValue(ctx, roleKey, member.Role)
		}

		ctx = context.WithValue(ctx, setKey, setID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
