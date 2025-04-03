package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/db"
)

func (h *Embed) JoinClass(w http.ResponseWriter, r *http.Request) {
	//curl -X POST localhost:8000/api/class_user -H "user_id: 1" -H "class_id: 1" -H "role: Student"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Database connection error", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id", "class_id", "role")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}

	cid, err := getInt32Id(headerVals["class_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	err = query.JoinClass(ctx, db.JoinClassParams{
		UserID:  uid,
		ClassID: cid,
		Role:    headerVals["role"],
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

func (h *Embed) LeaveClass(w http.ResponseWriter, r *http.Request) {
	//curl -X DELETE localhost:8000/api/class_user/ -H "user_id: 1" -H "class_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id", "class_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}

	cid, err := getInt32Id(headerVals["class_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid class id", http.StatusBadRequest)
		return
	}

	err = query.LeaveClass(ctx, db.LeaveClassParams{
		UserID:  uid,
		ClassID: cid,
	})
	if err != nil {
		logAndSendError(w, err, "Error leaving class", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode("Class left"); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusNoContent)
	w.Write([]byte{})

}

// func (h *Embed) GetStudentsOfAClass(w http.ResponseWriter, r *http.Request) {
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

// func (h *Embed) GetTeacherOfAClass(w http.ResponseWriter, r *http.Request) {
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

func (h *Embed) ListMembersOfAClass(w http.ResponseWriter, r *http.Request) {
	//curl -X GET localhost:8000/api/class_user/getmembers -H "class_id: 1"
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

	members, err := query.ListMembersOfAClass(ctx, cid)
	if err != nil {
		logAndSendError(w, err, "Error getting members", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(members); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}

func (h *Embed) ListClassesOfAUser(w http.ResponseWriter, r *http.Request) {
	//curl -X GET localhost:8000/api/class_user/getclasses -H "user_id: 1"
	query, ctx, conn, err := getQueryConnAndContext(r, h)
	if err != nil {
		logAndSendError(w, err, "Error connecting to database", http.StatusInternalServerError)
		return
	}
	defer conn.Release()

	headerVals, err := getHeaderVals(r, "user_id")
	if err != nil {
		logAndSendError(w, err, "Header error", http.StatusBadRequest)
		return
	}

	uid, err := getInt32Id(headerVals["user_id"])
	if err != nil {
		logAndSendError(w, err, "Invalid user id", http.StatusBadRequest)
		return
	}

	classes, err := query.ListClassesOfAUser(ctx, uid)
	if err != nil {
		logAndSendError(w, err, "Error getting classes", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(classes); err != nil {
		logAndSendError(w, err, "Error encoding message", http.StatusInternalServerError)
	}
}
