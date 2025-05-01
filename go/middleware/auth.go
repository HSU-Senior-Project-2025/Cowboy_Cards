package middleware

import (
	"context"
	"encoding/hex"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/sessions"
)

// ***************************
// *  LIVE backend           *
// ***************************
var (
	buildenv   = os.Getenv("BUILDENV")
	sessionKey = os.Getenv("SESSION_KEY")
	sKey, _    = hex.DecodeString(sessionKey)
	store      = sessions.NewCookieStore(sKey)
)

// ************************************************
// * uncomment this block and comment out the one *
// * above to dev with the LOCAL backend          *
// ************************************************
// var (
// buildenv = os.Getenv("BUILDENV")
// 	store = sessions.NewCookieStore([]byte{95, 65, 12, 40})
// )

func init() {
	log.Println("init")
	log.Println("mw init: ", buildenv)

	// MaxAge=0 means no Max-Age attribute specified and the cookie will be
	// deleted after the browser session ends.
	// MaxAge<0 means delete cookie immediately.
	// MaxAge>0 means Max-Age attribute present and given in seconds.

	// ******************************
	// * LIVE and LOCAL WEB backend *
	// ******************************

	store.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   0,
		Secure:   true,
		HttpOnly: true,
	}

	if buildenv == "" {
		store.Options.SameSite = http.SameSiteNoneMode
	} else if buildenv == "prod" {
		store.Options.SameSite = http.SameSiteStrictMode
	}

	// **********************************************************
	// uncomment this and comment the one above to dev MOBILE
	// **********************************************************
	//
	// store.Options = &sessions.Options{
	// 	Path:     "/",
	// 	MaxAge:   0,
	// 	Secure:   false,
	// 	HttpOnly: true,
	// 	SameSite: http.SameSiteLaxMode,
	// }
}

func Auth(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	log.Printf("DEBUG: Auth middleware called for path: %s", r.URL.Path)

	ctx := r.Context()

	// Log all cookies received in the request
	cookies := r.Cookies()
	if len(cookies) > 0 {
		log.Printf("DEBUG: Request contains %d cookies", len(cookies))
		for _, cookie := range cookies {
			log.Printf("DEBUG: Cookie found - Name: %s, Path: %s, Domain: %s", cookie.Name, cookie.Path, cookie.Domain)
		}
	} else {
		log.Printf("DEBUG: No cookies found in request")
	}

	session, err := store.Get(r, sessionName)
	if err != nil {
		LogAndSendError(w, err, "Failed to get session", http.StatusInternalServerError)
		return
	}

	// Check if user is authenticated
	if auth, ok := session.Values["authenticated"].(bool); !ok || !auth {
		LogAndSendError(w, errors.New("unauthed"), "User not authenticated, redirecting", http.StatusUnauthorized)
		return
	}

	// Get user ID from session
	userID, ok := session.Values["user_id"].(int32)
	if !ok {
		LogAndSendError(w, errors.New("unauthed"), "User not authorized, redirecting", http.StatusUnauthorized)
		return
	}

	ctx = context.WithValue(ctx, userKey, userID)
	next(w, r.WithContext(ctx))
}

func CreateSession(w http.ResponseWriter, r *http.Request, userID int32) error {
	log.Printf("DEBUG: Creating session for user ID: %d", userID)
	session, err := store.Get(r, sessionName)
	if err != nil {
		log.Printf("ERROR: Failed to get session: %v", err)
		return err
	}

	// Set session values
	session.Values["authenticated"] = true
	session.Values["user_id"] = userID
	// session.Values["session_id"] = uuid.NewString()
	session.Values["created_at"] = time.Now().Unix()
	// session.Values["paseto_token"] = token

	log.Printf("DEBUG: Session cookie options: Path=%s, MaxAge=%d, HttpOnly=%v, Secure=%v, SameSite=%v",
		session.Options.Path, session.Options.MaxAge, session.Options.HttpOnly, session.Options.Secure, session.Options.SameSite)
	// Save session
	err = session.Save(r, w)
	if err != nil {
		log.Printf("ERROR: Failed to save session: %v", err)
		return err
	}

	log.Printf("DEBUG: Session successfully created for user ID: %d", userID)
	return nil
}

// ClearSession removes the session for the current user
// func ClearSession(w http.ResponseWriter, r *http.Request) error {
// 	session, err := store.Get(r, sessionName)
// 	if err != nil {
// 		return err
// 	}

// 	// Clear session values
// 	session.Values = make(map[interface{}]interface{})

// 	// Set MaxAge to -1 to delete the cookie
// 	session.Options.MaxAge = -1

// 	// Save session
// 	return session.Save(r, w)
// }
