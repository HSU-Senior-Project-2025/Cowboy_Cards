package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
)

func (h *DBHandler) AddSetToClass(w http.ResponseWriter, r *http.Request) {
	// curl POST localhost:8000/api/class_set -H "id: 1" -H "set_id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	role, ok := middleware.GetRoleFromContext(ctx)
	if !ok || role != teacher {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	classID, ok := middleware.GetClassIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Invalid class id", http.StatusUnauthorized)
		return
	}

	headerVals, err := getHeaderVals(r, set_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	setID, err := getInt32Id(headerVals[set_id])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	err = query.AddSetToClass(ctx, db.AddSetToClassParams{
		ClassID: classID,
		SetID:   setID,
	})
	if err != nil {
		logAndSendError(w, err, "Error adding set", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode("Set added"); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *DBHandler) RemoveSetFromClass(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/api/class_set/ -H "id: 1" -H "set_id"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	role, ok := middleware.GetRoleFromContext(ctx)
	if !ok || role != teacher {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	classID, ok := middleware.GetClassIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Invalid class id", http.StatusUnauthorized)
		return
	}

	headerVals, err := getHeaderVals(r, set_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	setID, err := getInt32Id(headerVals[set_id])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	err = query.RemoveSetFromClass(ctx, db.RemoveSetFromClassParams{
		ClassID: classID,
		SetID:   setID,
	})
	if err != nil {
		logAndSendError(w, err, "Error removing set", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}

func (h *DBHandler) ListSetsInClass(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/class_set/list_sets -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	cid, err := getInt32Id(headerVals[id])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	sets, err := query.ListSetsInClass(ctx, cid)
	if err != nil {
		logAndSendError(w, err, "Error getting sets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(sets); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) ListClassesHavingSet(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/class_set/list_classes -H "set_id"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, set_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	sid, err := getInt32Id(headerVals[set_id])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	classes, err := query.ListClassesHavingSet(ctx, sid)
	if err != nil {
		logAndSendError(w, err, "Error getting classes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}
