package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

func (h *Embed) AddSet(w http.ResponseWriter, r *http.Request) {
	// curl POST localhost:8000/api/class_set -H "class_id: 1" -H "set_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "class_id", "set_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	cid, err := getInt32Id(headerVals["class_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	sid, err := getInt32Id(headerVals["set_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	err = query.AddSet(ctx, db.AddSetParams{
		ClassID: cid,
		SetID:   sid,
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

func (h *Embed) RemoveSet(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE localhost:8000/api/class_user/ -H "class_id: 1" -H "set_id"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "class_id", "set_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	cid, err := getInt32Id(headerVals["class_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid class_id", http.StatusBadRequest)
		return
	}

	sid, err := getInt32Id(headerVals["set_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	err = query.RemoveSet(ctx, db.RemoveSetParams{
		ClassID: cid,
		SetID:   sid,
	})
	if err != nil {
		logAndSendError(w, err, "Error removing set", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}

func (h *Embed) GetSetsInClass(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/class_set/get_sets -H "class_id"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "class_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	cid, err := getInt32Id(headerVals["class_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	sets, err := query.GetSetsInClass(ctx, cid)
	if err != nil {
		logAndSendError(w, err, "Error getting sets", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(sets); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) GetClassesHavingSet(w http.ResponseWriter, r *http.Request) {
	// curl -X GET localhost:8000/api/class_set/get_classes -H "set_id"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "set_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	sid, err := getInt32Id(headerVals["set_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid set id", http.StatusBadRequest)
		return
	}

	classes, err := query.GetClassesHavingSet(ctx, sid)
	if err != nil {
		logAndSendError(w, err, "Error getting classes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}
