package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"
	"strings"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgtype"
)

func (h *Handler) ListClasses(w http.ResponseWriter, r *http.Request) {
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

	// w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) GetClassById(w http.ResponseWriter, r *http.Request) {
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

	if err := json.NewEncoder(w).Encode(class); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) CreateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X POST localhost:8000/class -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "name", "description", "joincode", "teacherid")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	tid, err := getInt32Id(headerVals["teacherid"])
	if err != nil {
		logAndSendError(w, err, "Invalid teacher id", http.StatusBadRequest)
		return
	}

	err = query.CreateClass(ctx, db.CreateClassParams{
		Name:        headerVals["name"],
		Description: headerVals["description"],
		JoinCode:    headerVals["joincode"],
		TeacherID:   pgtype.Int4{Int32: int32(tid), Valid: true},
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create class", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode("Class created"); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *Handler) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT http://localhost:8000/api/classes/description -H "id: 1" -H "description: 1st german"

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

	if strings.HasSuffix(route, "id") {
		var res pgtype.Int4
		switch route {
		case "teacherid":
			tid, err := getInt32Id(val)
			if err != nil {
				logAndSendError(w, err, "Invalid teacher id", http.StatusBadRequest)
				return
			}

			res, err = query.UpdateClassTeacherId(ctx, db.UpdateClassTeacherIdParams{
				TeacherID: pgtype.Int4{Int32: int32(tid), Valid: true},
				ID:        id,
			})
			if err != nil {
				logAndSendError(w, err, "Failed to update class", http.StatusInternalServerError)
				return
			}
		default:
			logAndSendError(w, errors.New("invalid column"), "Improper header", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(res); err != nil {
			logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
		}
	} else {
		var res string
		switch route {
		case "name":
			res, err = query.UpdateClassName(ctx, db.UpdateClassNameParams{
				Name: val,
				ID:   id,
			})
		case "description":
			res, err = query.UpdateClassDescription(ctx, db.UpdateClassDescriptionParams{
				Description: val,
				ID:          id,
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
}

func (h *Handler) DeleteClass(w http.ResponseWriter, r *http.Request) {
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
