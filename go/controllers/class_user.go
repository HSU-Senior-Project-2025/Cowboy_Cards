package controllers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/middleware"
)

func (h *DBHandler) JoinClass(w http.ResponseWriter, r *http.Request) {
	//curl -X POST localhost:8000/api/class_user -H "class_id: 1" -H "role: Student"

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

	headerVals, err := getHeaderVals(r, class_id, roleStr)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	classID, err := getInt32Id(headerVals[class_id])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	err = query.JoinClass(ctx, db.JoinClassParams{
		UserID:  userID,
		ClassID: classID,
		Role:    headerVals[roleStr],
	})
	if err != nil {
		logAndSendError(w, err, "Failed to join class", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode("Class joined"); err != nil {
		logAndSendError(w, err, "Error encoding response", http.StatusInternalServerError)
	}
}

func (h *DBHandler) LeaveClass(w http.ResponseWriter, r *http.Request) {
	//curl -X DELETE localhost:8000/api/class_user/ -H "user_id: 1" -H "class_id: 1"

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

	headerVals, err := getHeaderVals(r, student_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	studentID, err := getInt32Id(headerVals[student_id])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	params := db.LeaveClassParams{
		ClassID: classID,
	}

	if userID == studentID {
		params.UserID = userID
	} else {
		if role == teacher {
			params.UserID = studentID
		} else {
			logAndSendError(w, errors.New("forbidden"), "not a teacher", http.StatusUnauthorized)
			return
		}
	}

	err = query.LeaveClass(ctx, params)
	if err != nil {
		logAndSendError(w, err, "Error leaving class", http.StatusInternalServerError)
		return
	}

	// no body is sent with a 204 response
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})
}

func (h *DBHandler) ListClassesOfAUser(w http.ResponseWriter, r *http.Request) {
	//curl -X GET localhost:8000/api/class_user/getclasses -H "user_id: 1"

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

	classes, err := query.ListClassesOfAUser(ctx, userID)
	if err != nil {
		logAndSendError(w, err, "Error getting classes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *DBHandler) ListMembersOfAClass(w http.ResponseWriter, r *http.Request) {
	//curl -X GET localhost:8000/api/class_user/getmembers -H "class_id: 1"

	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, class_id)
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	classID, err := getInt32Id(headerVals[class_id])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	members, err := query.ListMembersOfAClass(ctx, classID)
	if err != nil {
		logAndSendError(w, err, "Error getting members", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(members); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

// func (h *DBHandler) GetStudentsOfAClass(w http.ResponseWriter, r *http.Request) {
// 	//curl -X GET localhost:8000/api/class_user/getstudents -H "class_id: 1"
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

// 	cid, err := getInt32Id(headerVals["class_id"])
// 	if err != nil {
// 		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
// 		return
// 	}

// 	students, err := query.GetStudentsOfAClass(ctx, cid)
// 	if err != nil {
// 		logAndSendError(w, err, "Error getting students", http.StatusInternalServerError)
// 		return
// 	}

// 	if err := json.NewEncoder(w).Encode(students); err != nil {
// 		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
// 	}
// }

// func (h *DBHandler) GetTeacherOfAClass(w http.ResponseWriter, r *http.Request) {
// 	//curl -X GET localhost:8000/api/class_user/getstudents -H "class_id: 1"
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

// 	cid, err := getInt32Id(headerVals["class_id"])
// 	if err != nil {
// 		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
// 		return
// 	}

// 	teacher, err := query.GetTeacherOfAClass(ctx, cid)
// 	if err != nil {
// 		logAndSendError(w, err, "Error getting teacher", http.StatusInternalServerError)
// 		return
// 	}

// 	if err := json.NewEncoder(w).Encode(teacher); err != nil {
// 		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
// 	}
// }
