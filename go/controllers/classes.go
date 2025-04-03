package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgtype"
)

func (h *Embed) ListClasses(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/classes/list | jq

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	classes, err := query.ListClasses(ctx)
	if err != nil {
		logAndSendError(w, err, "Error getting classes from DB", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) GetClassById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/classes/ -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	id, err := getInt32Id(headerVals["id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	class, err := query.GetClassById(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to get class", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(class); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) CreateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/api/classes -H "name: class name" -H "description: class description" -H "private t/f

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// "private"
	headerVals, err := getHeaderVals(r, "class_name", "class_description")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	tx, err := conn.Begin(ctx)
	if err != nil {
		logAndSendError(w, err, "Database tx connection error", http.StatusInternalServerError)
	}
	defer tx.Rollback(ctx)

	qtx := query.WithTx(tx)

	class, err := qtx.CreateClass(ctx, db.CreateClassParams{
		ClassName:        headerVals["class_name"],
		ClassDescription: headerVals["class_description"],
		JoinCode:         pgtype.Text{String: "123", Valid: false},
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create class", http.StatusInternalServerError)
		return
	}

	err = qtx.JoinClass(ctx, db.JoinClassParams{
		UserID:  int32(1),
		ClassID: class.ID,
		Role:    "teacher",
	})
	if err != nil {
		logAndSendError(w, err, "Failed to join class", http.StatusInternalServerError)
		return
	}

	err = tx.Commit(ctx)
	if err != nil {
		logAndSendError(w, err, "Failed to commit transaction", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(class); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT http://localhost:8000/api/classes/class_description -H "id: 9" -H "class_description: 1st german"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	route := path.Base(r.URL.Path)

	headerVals, err := getHeaderVals(r, "id", route)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	id, err := getInt32Id(headerVals["id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	val := headerVals[route]

	var res string
	switch route {
	case "class_name":
		res, err = query.UpdateClassName(ctx, db.UpdateClassNameParams{
			ClassName: val,
			ID:        id,
		})
	case "class_description":
		res, err = query.UpdateClassDescription(ctx, db.UpdateClassDescriptionParams{
			ClassDescription: val,
			ID:               id,
		})
	default:
		logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
		return
	}

	if err != nil {
		logAndSendError(w, err, "Failed to update class", http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(res); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Embed) DeleteClass(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE http://localhost:8000/api/classes/ -H "id: 2"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	id, err := getInt32Id(headerVals["id"])
	if err != nil {
		logAndSendError(w, err, "Invalid id", http.StatusBadRequest)
		return
	}

	err = query.DeleteClass(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to delete class", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}

func (h *Embed) GetClassScores(w http.ResponseWriter, r *http.Request) {
	// curl -GET http://localhost:8000/classes/get_scores -H "class_id: 1"
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

	scores, err := query.GetClassScores(ctx, cid)
	if err != nil {
		logAndSendError(w, err, "Error getting scores", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(scores); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}

}
