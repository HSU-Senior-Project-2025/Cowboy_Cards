package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

// every protected route is preceded by /api
func Protected(r *chi.Mux, h *controllers.DBHandler) {

	// -------------------complex-------------------------

	r.Route("/card_history", func(r chi.Router) {
		// these are upserts, one each for (in)correct
		r.Post("/correct", h.UpdateFlashcardScore)
		r.Post("/incorrect", h.UpdateFlashcardScore)

		r.Get("/", h.GetCardScore)
		r.Get("/set", h.GetScoresInASet)
	})

	r.Route("/class_set", func(r chi.Router) {
		r.Post("/", h.AddSet)
		r.Delete("/", h.RemoveSet)
		r.Get("/get_sets", h.GetSetsInClass)
		r.Get("/get_classes", h.GetClassesHavingSet)
	})

	r.Route("/class_user", func(r chi.Router) {
		r.Post("/", h.JoinClass)
		r.Delete("/", h.LeaveClass)
		r.Get("/classes", h.ListClassesOfAUser)
		r.Get("/members", h.ListMembersOfAClass)
		// r.Get("/getstudents", h.ListStudentsOfAClass)
		// r.Get("/getteacher", h.ListTeachersOfAClass)
	})

	// -------------------simple-------------------------

	// r.Post("/logout", h.Logout)

	r.Route("/classes", func(r chi.Router) {
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifyClassMemberMW)
			r.Get("/", h.GetClassById)
			r.Put("/class_name", h.UpdateClass)
			r.Put("/class_description", h.UpdateClass)
			r.Delete("/", h.DeleteClass)
		})

		r.Route("/leaderboard", func(r chi.Router) {
			r.Use(h.VerifyClassMemberMW)
			r.Get("/", h.GetClassLeaderboard)
		})

		r.Get("/list", h.ListClasses)
		r.Post("/", h.CreateClass)
	})

	r.Route("/flashcards", func(r chi.Router) {
		r.Get("/", h.GetFlashcardById)
		r.Get("/list", h.ListFlashcardsOfASet)
		r.Post("/", h.CreateFlashcard)
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifyFlashcardOwnerMW) // Ensure only the owner can update/delete
			r.Put("/front", h.UpdateFlashcard)
			r.Put("/back", h.UpdateFlashcard)
			r.Put("/set_id", h.UpdateFlashcard)
			r.Delete("/", h.DeleteFlashcard)
		})

		r.Route("/sets", func(r chi.Router) {
			r.Get("/list", h.ListFlashcardSets)
			r.Post("/", h.CreateFlashcardSet)
			r.Route("/", func(r chi.Router) {
				r.Use(h.VerifySetOwnerMW) // Ensure only the owner can update/delete the set
				r.Get("/", h.GetFlashcardSetById)
				r.Put("/set_name", h.UpdateFlashcardSet)
				r.Put("/set_description", h.UpdateFlashcardSet)
				r.Delete("/", h.DeleteFlashcardSet)
			})
		})
	})

	// CreateUser and GetUserBy{Email,Username} are called from the unprotected routes
	// no mw seems necessary here - id comes from cookie only
	r.Route("/users", func(r chi.Router) {
		// r.Get("/list", h.ListUsers)
		r.Get("/", h.GetUserById)
		r.Put("/username", h.UpdateUser)
		r.Put("/email", h.UpdateUser)
		r.Put("/first_name", h.UpdateUser)
		r.Put("/last_name", h.UpdateUser)
		r.Put("/password", h.UpdateUser)
		// r.Delete("/", h.DeleteUser)
	})
}

// auth
func Unprotected(r *chi.Mux, h *controllers.DBHandler) {
	r.Post("/login", h.Login)
	r.Post("/signup", h.Signup)
}
