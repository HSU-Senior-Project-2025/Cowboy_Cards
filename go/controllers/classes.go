package controllers

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/jackc/pgx/v5/pgtype"
)

func (h *Handler) ListClasses(w http.ResponseWriter, r *http.Request) {
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
	// curl -X GET localhost:8000/class -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	id, err := getRowId(r)
	if err != nil {
		logAndSendError(w, err, "Id error", http.StatusBadRequest)
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

	// query, ctx, conn, err := getQueryConnAndContext(r, h)
	// if err != nil {
	// 	logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
	// 	return
	// }
	// defer conn.Release()

	headerVals, err := getCreateHeaderVals(r, []string{"name", "description", "joincode", "teacherid"})
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	for k, v := range headerVals {
		log.Println("key: ", k, "val: ", v)
	}
	w.Write([]byte{65, 10})
	// teacherId, err := strconv.Atoi(idStr)
	// if err != nil || teacherId == 0 {
	// 	logAndSendError(w, err, "Invalid teacher id", http.StatusBadRequest)
	// 	return
	// }

	// id := pgtype.Int4{Int32: int32(teacherId), Valid: true}

	// err = query.CreateClass(ctx, db.CreateClassParams{
	// 	Name:        name,
	// 	Description: description,
	// 	JoinCode:    joincode,
	// 	TeacherID:   id,
	// })
	// if err != nil {
	// 	logAndSendError(w, err, "Failed to create class", http.StatusInternalServerError)
	// 	return
	// }

	// w.WriteHeader(http.StatusCreated)
	// if err := json.NewEncoder(w).Encode(ZeroRowSuccessResponse{Resp: "Class created successfully"}); err != nil {
	// 	logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	// }
}

func (h *Handler) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT localhost:8000/class -H "id: 1" -H "name: class name" -H "description: class description" -H "joincode: join code" -H "teacherid: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	updateInfo := getUpdateHeaderVal(r)
	if updateInfo.err != nil {
		logAndSendError(w, updateInfo.err, "Header error", http.StatusBadRequest)
		return
	}

	if updateInfo.numeric {
		var res pgtype.Int4
		switch updateInfo.col {
		case "teacherId":
			teacherId, err := strconv.Atoi(updateInfo.val)
			if err != nil || teacherId < 1 {
				logAndSendError(w, errors.New("invalid column data"), "Invalid teacher id", http.StatusBadRequest)
				return
			}

			tId := pgtype.Int4{Int32: int32(teacherId), Valid: true}

			res, err = query.UpdateClassTeacherId(ctx, db.UpdateClassTeacherIdParams{
				TeacherID: tId,
				ID:        updateInfo.id,
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
		switch updateInfo.col {
		case "name":
			res, err = query.UpdateClassName(ctx, db.UpdateClassNameParams{
				Name: updateInfo.val,
				ID:   updateInfo.id,
			})
		case "description":
			res, err = query.UpdateClassDescription(ctx, db.UpdateClassDescriptionParams{
				Description: updateInfo.val,
				ID:          updateInfo.id,
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
	// curl -X DELETE localhost:8000/class -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	id, err := getRowId(r)
	if err != nil {
		logAndSendError(w, err, "Id error", http.StatusBadRequest)
	}

	err = query.DeleteClass(ctx, id)
	if err != nil {
		logAndSendError(w, err, "Failed to delete class", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
	if err := json.NewEncoder(w).Encode(ZeroRowSuccessResponse{Resp: "Class deleted successfully"}); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}
