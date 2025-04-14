package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"
	"strings"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"golang.org/x/crypto/bcrypt"
)

// func (h *DBHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
// 	// curl http://localhost:8000/api/users/list | jq

// 	query, ctx, conn, err := getQueryConnAndContext(r, h)
// 	if err != nil {
// 		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
// 		return
// 	}
// 	defer conn.Release()

// 	users, err := query.ListUsers(ctx)
// 	if err != nil {
// 		logAndSendError(w, err, "Error getting users from DB", http.StatusInternalServerError)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	if err := json.NewEncoder(w).Encode(users); err != nil {
// 		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
// 	}
// }

// GetUser handles retrieving user information
func (h *DBHandler) GetUserById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/users/ -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tx, err := conn.Begin(ctx)
	if err != nil {
		logAndSendError(w, err, "Database tx connection error", http.StatusInternalServerError)
	}
	defer tx.Rollback(ctx)

	qtx := query.WithTx(tx)

	user, err := qtx.GetUserById(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "User not found", http.StatusNotFound)
		return
	}

	classes, err := qtx.ListClassesOfAUser(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Error getting classes", http.StatusInternalServerError)
		return
	}

	cardsStudied, err := qtx.GetCardsStudied(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Error getting cards studied", http.StatusInternalServerError)
		return
	}

	cardsMastered, err := qtx.GetCardsMastered(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Error getting cards mastered", http.StatusInternalServerError)
		return
	}

	totalCardViews, err := qtx.GetTotalCardViews(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Error getting total card views", http.StatusInternalServerError)
		return
	}

	err = tx.Commit(ctx)
	if err != nil {
		logAndSendError(w, err, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	response := User{
		// ID:        user.ID,
		Username:    user.Username,
		Email:       user.Email,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		LoginStreak: user.LoginStreak,
		CreatedAt:   user.CreatedAt.Time.Format(time.DateTime),
		// UpdatedAt: user.UpdatedAt.Time,
		NumClasses:     len(classes),
		CardsStudied:   int(cardsStudied),
		CardsMastered:  int(cardsMastered),
		TotalCardViews: int(totalCardViews),
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// UpdateUser handles updating user information
func (h *DBHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT http://localhost:8000/api/users/email -H "id: 1" -H "email: a@a.com"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	route := path.Base(r.URL.Path)

	headerVals, err := getHeaderVals(r, route)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	val := headerVals[route]

	var res string
	switch route {
	case username:
		_, err = query.GetUserByUsername(ctx, val)
		if err == nil {
			logAndSendError(w, err, "Username already exists", http.StatusConflict)
			return
		} else if !strings.Contains(err.Error(), "no rows") {
			logAndSendError(w, err, "Error checking username", http.StatusInternalServerError)
			return
		}

		res, err = query.UpdateUsername(ctx, db.UpdateUsernameParams{
			Username: val,
			ID:       userID,
		})
	case email:
		_, err = query.GetUserByEmail(ctx, val)
		if err == nil {
			logAndSendError(w, err, "Email already exists", http.StatusConflict)
			return
		} else if !strings.Contains(err.Error(), "no rows") {
			logAndSendError(w, err, "Error checking email", http.StatusInternalServerError)
			return
		}

		res, err = query.UpdateEmail(ctx, db.UpdateEmailParams{
			Email: val,
			ID:    userID,
		})
	case first_name:
		res, err = query.UpdateFirstname(ctx, db.UpdateFirstnameParams{
			FirstName: val,
			ID:        userID,
		})
	case last_name:
		res, err = query.UpdateLastname(ctx, db.UpdateLastnameParams{
			LastName: val,
			ID:       userID,
		})
	case password:
		// *************
		// needs more validation here
		// usual min pw len: 8, bcrypt max: 72 bytes
		// *************

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(val), bcrypt.DefaultCost)
		if err != nil {
			logAndSendError(w, err, "Error hashing password", http.StatusInternalServerError)
			return
		}

		res = "Password updated"
		err = query.UpdatePassword(ctx, db.UpdatePasswordParams{
			Password: string(hashedPassword),
			ID:       userID,
		})
		if err != nil {
			logAndSendError(w, err, "Failed to update user", http.StatusInternalServerError)
			return
		}
	default:
		logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
		return
	}

	if err != nil {
		logAndSendError(w, err, "Failed to update user", http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(res); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// DeleteUser handles user account deletion
func (h *DBHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err = query.DeleteUser(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}
