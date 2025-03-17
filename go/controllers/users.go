package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"
	"strings"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) ListUsers(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/users/list | jq

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	users, err := query.ListUsers(ctx)
	if err != nil {
		logAndSendError(w, err, "Error getting users from DB", http.StatusInternalServerError)
		return
	}

	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(users); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// GetUser handles retrieving user information
func (h *Handler) GetUserById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/users/ -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	id, ok := middleware.FromContext(ctx)
	if !ok {
		logAndSendError(w, err, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// headerVals, err := getHeaderVals(r, "id")
	// if err != nil {
	// 	logAndSendError(w, err, "Header error", http.StatusBadRequest)
	// 	return
	// }

	// id, err := getInt32Id(headerVals["id"])
	// if err != nil {
	// 	logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
	// 	return
	// }

	user, err := query.GetUserById(ctx, id)
	if err != nil {
		logAndSendError(w, err, "User not found", http.StatusNotFound)
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

	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

// UpdateUser handles updating user information
func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT http://localhost:8000/api/users/email -H "id: 1" -H "email: a@a.com"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	id, ok := middleware.FromContext(ctx)
	if !ok {
		logAndSendError(w, err, "Unauthorized", http.StatusUnauthorized)
		return
	}

	route := path.Base(r.URL.Path)

	headerVals, err := getHeaderVals(r, route)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	// id, err := getInt32Id(headerVals["id"])
	// if err != nil {
	// 	logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
	// 	return
	// }

	val := headerVals[route]

	var res string
	switch route {
	case "username":
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
			ID:       id,
		})
	case "email":
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
			ID:    id,
		})
	case "firstname":
		res, err = query.UpdateFirstname(ctx, db.UpdateFirstnameParams{
			FirstName: val,
			ID:        id,
		})
	case "lastname":
		res, err = query.UpdateLastname(ctx, db.UpdateLastnameParams{
			LastName: val,
			ID:       id,
		})
	case "password":
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
			ID:       id,
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
func (h *Handler) DeleteUser(w http.ResponseWriter, r *http.Request) {

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	id, ok := middleware.FromContext(ctx)
	if !ok {
		logAndSendError(w, err, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// headerVals, err := getHeaderVals(r, "id")
	// if err != nil {
	// 	logAndSendError(w, err, "Header error", http.StatusBadRequest)
	// 	return
	// }

	// id, err := getInt32Id(headerVals["id"])
	// if err != nil {
	// 	logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
	// 	return
	// }

	err = query.DeleteUser(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to delete user", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}
