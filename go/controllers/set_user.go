package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
)

func (h *DBHandler) JoinSet(w http.ResponseWriter, r *http.Request) {
	// curl POST localhost:8000/api/class_set -H "id: 1" -H "set_id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	headerVals, err := getHeaderVals(r, set_id, roleStr)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	setID, err := getInt32Id(headerVals[set_id])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	err = query.JoinSet(ctx, db.JoinSetParams{
		UserID: userID,
		SetID:  setID,
		Role:   headerVals[roleStr],
	})
	if err != nil {
		logAndSendError(w, err, "Error adding set", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode("Set joined"); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *DBHandler) LeaveSet(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/api/class_user/ -H "id: 1" -H "set_id"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	setID, ok := middleware.GetSetIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err = query.LeaveSet(ctx, db.LeaveSetParams{
		UserID: userID,
		SetID:  setID,
	})
	if err != nil {
		logAndSendError(w, err, "Error removing set", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}

func (h *DBHandler) ListSetsOfAUser(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/class_set/list_sets -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	sets, err := query.ListSetsOfAUser(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Error getting sets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(sets); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}
