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
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifyClassMemberMW)
			r.Post("/", h.AddSetToClass)
			r.Delete("/", h.RemoveSetFromClass) //never called
		})
		r.Get("/list_sets", h.ListSetsInClass)
		r.Get("/list_classes", h.ListClassesHavingSet)
	})

	r.Route("/class_user", func(r chi.Router) {
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifyClassMemberMW)
			r.Delete("/", h.LeaveClass)
		})

		r.Post("/", h.JoinClass)
		r.Get("/classes", h.ListClassesOfAUser)
		r.Get("/members", h.ListMembersOfAClass)
		// r.Get("/getstudents", h.ListStudentsOfAClass)
		// r.Get("/getteacher", h.ListTeachersOfAClass)
	})

	r.Route("/set_user", func(r chi.Router) {
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifySetMemberMW)
			r.Delete("/", h.LeaveSet) //never called
		})
		r.Post("/", h.JoinSet)
		r.Get("/list", h.ListSetsOfAUser)
	})

	// -------------------simple-------------------------

	// r.Post("/logout", h.Logout)

	r.Route("/classes", func(r chi.Router) {
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifyClassMemberMW)
			r.Get("/", h.GetClassById)
			r.Put("/class_name", h.UpdateClass)
			r.Put("/class_description", h.UpdateClass)
			r.Delete("/", h.DeleteClass) //never called
		})

		r.Route("/leaderboard", func(r chi.Router) {
			r.Use(h.VerifyClassMemberMW)
			r.Get("/", h.GetClassLeaderboard)
		})

		r.Get("/list", h.ListClasses)
		r.Post("/", h.CreateClass)
	})

	r.Route("/flashcards", func(r chi.Router) {
		r.Route("/", func(r chi.Router) {
			r.Use(h.VerifySetMemberMW) // Ensure only the owner can update/delete
			r.Post("/", h.CreateFlashcard)
			r.Put("/front", h.UpdateFlashcard)
			r.Put("/back", h.UpdateFlashcard)
			// r.Put("/set_id", h.UpdateFlashcard)
			r.Delete("/", h.DeleteFlashcard)
		})
		r.Get("/", h.GetFlashcardById)
		r.Get("/list", h.ListFlashcardsOfASet)

		r.Route("/sets", func(r chi.Router) {
			r.Route("/", func(r chi.Router) {
				r.Use(h.VerifySetMemberMW) // Ensure only the owner can update/delete the set
				r.Get("/", h.GetFlashcardSetById)
				r.Put("/set_name", h.UpdateFlashcardSet)
				r.Put("/set_description", h.UpdateFlashcardSet)
				r.Delete("/", h.DeleteFlashcardSet)
			})
			r.Get("/list", h.ListFlashcardSets)
			r.Post("/", h.CreateFlashcardSet)
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
		r.Delete("/", h.DeleteUser)
	})
}

// auth
func Unprotected(r *chi.Mux, h *controllers.DBHandler) {
	r.Post("/login", h.Login)
	r.Post("/signup", h.Signup)
	r.Post("/send-reset-password-token", h.SendResetPasswordToken)
	r.Post("/reset-password", h.ResetPassword)
}
