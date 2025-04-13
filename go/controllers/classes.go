package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path"
	"time"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
)

func (h *DBHandler) ListClasses(w http.ResponseWriter, r *http.Request) {
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

func (h *DBHandler) GetClassById(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/classes/ -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	classID, ok := middleware.GetClassIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	role, ok := middleware.GetRoleFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	class, err := query.GetClassById(ctx, classID)
	if err != nil {
		logAndSendError(w, err, "Failed to get class", http.StatusInternalServerError)
		return
	}

	response := Class{
		ID:               class.ID,
		ClassName:        class.ClassName,
		ClassDescription: class.ClassDescription,
		CreatedAt:        class.CreatedAt.Time.Format(time.DateTime),
		UpdatedAt:        class.UpdatedAt.Time.Format(time.DateTime),
		Role:             role,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) GetClassLeaderboard(w http.ResponseWriter, r *http.Request) {
	// curl http://localhost:8000/api/classes/leaderboard -H "id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	classID, ok := middleware.GetClassIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	scores, err := query.GetClassLeaderboard(ctx, classID)
	if err != nil {
		logAndSendError(w, err, "Error getting scores", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err = json.NewEncoder(w).Encode(scores); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) CreateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X POST --cookie "cookie" localhost:8000/api/classes/ -H "class_name: Exploring Knights Errant" -H "class_description: Knights Errant"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	// "private"
	headerVals, err := getHeaderVals(r, class_name, class_description)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	// Get user_id from context (set by AuthMiddleware)
	userID, ok := middleware.GetUserIDFromContext(ctx)
	if !ok {
		middleware.LogAndSendError(w, errContext, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tx, err := conn.Begin(ctx)
	if err != nil {
		logAndSendError(w, err, "Database tx connection error", http.StatusInternalServerError)
	}
	defer tx.Rollback(ctx)

	qtx := query.WithTx(tx)

	class, err := qtx.CreateClass(ctx, db.CreateClassParams{
		ClassName:        headerVals[class_name],
		ClassDescription: headerVals[class_description],
	})
	if err != nil {
		logAndSendError(w, err, "Failed to create class", http.StatusInternalServerError)
		return
	}

	err = qtx.JoinClass(ctx, db.JoinClassParams{
		UserID:  userID,
		ClassID: class.ID,
		Role:    teacher,
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

func (h *DBHandler) UpdateClass(w http.ResponseWriter, r *http.Request) {
	// curl -X PUT http://localhost:8000/api/classes/class_description -H "id: 9" -H "class_description: 1st german"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	role, ok := middleware.GetRoleFromContext(ctx)
	if !ok || role != teacher {
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

	classID, ok := middleware.GetClassIDFromContext(ctx)
	if !ok {
		logAndSendError(w, errContext, "context error", http.StatusInternalServerError)
		return
	}

	var res string
	switch route {
	case class_name:
		res, err = query.UpdateClassName(ctx, db.UpdateClassNameParams{
			ClassName: val,
			ID:        classID,
		})
	case class_description:
		res, err = query.UpdateClassDescription(ctx, db.UpdateClassDescriptionParams{
			ClassDescription: val,
			ID:               classID,
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

func (h *DBHandler) DeleteClass(w http.ResponseWriter, r *http.Request) {
	// curl -X DELETE http://localhost:8000/api/classes/ -H "id: 2"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
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
		logAndSendError(w, errContext, "context error", http.StatusInternalServerError)
		return
	}

	err = query.DeleteClass(ctx, classID)
	if err != nil {
		logAndSendError(w, err, "Failed to delete class", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}

// func (h *DBHandler) GetClassScores(w http.ResponseWriter, r *http.Request) {
// 	// curl -GET http://localhost:8000/classes/get_scores -H "class_id: 1"

// 	query, ctx, conn, err := getQueryConnAndContext(r, h)
// 	if err != nil {
// 		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
// 		return
// 	}
// 	defer conn.Release()

// 	headerVals, err := getHeaderVals(r, "class_id")
// 	if err != nil {
// 		logAndSendError(w, err, "Header error", http.StatusBadRequest)
// 		return
// 	}

// 	classID, err := getInt32Id(headerVals["class_id"])
// 	if err != nil {
// 		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
// 		return
// 	}

// 	scores, err := query.GetClassScores(ctx, classID)
// 	if err != nil {
// 		logAndSendError(w, err, "Error getting scores", http.StatusInternalServerError)
// 		return
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	if err = json.NewEncoder(w).Encode(scores); err != nil {
// 		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
// 	}
// }
