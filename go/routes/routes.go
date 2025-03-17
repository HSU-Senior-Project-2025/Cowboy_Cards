package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

// every protected route is preceded by /api
func Protected(r *chi.Mux, h *controllers.Handler) {
	r.Route("/classes", func(r chi.Router) {
		r.Get("/list", h.ListClasses)
		r.Get("/", h.GetClassById)
		r.Post("/", h.CreateClass)
		r.Put("/name", h.UpdateClass)
		r.Put("/description", h.UpdateClass)
		r.Put("/teacherid", h.UpdateClass)
		r.Delete("/", h.DeleteClass)
	})

	r.Route("/flashcards", func(r chi.Router) {
		// r.Get("/", h.GetFlashcardById)
		// r.Post("/", h.CreateFlashCard)
		// r.Put("/front", h.UpdateFlashcardFront)
		// r.Put("/back", h.UpdateFlashcardBack)
		// r.Put("/sid", h.UpdateFlashcardSetId)
		// r.Delete("/", h.DeleteFlashCard)

		r.Route("/sets", func(r chi.Router) {
			// r.Get("/", h.GetFlashcardSetById)
			// r.Post("/", h.CreateFlashCardSet)
			// r.Put("/name", h.UpdateFlashcardSetName)
			// r.Put("/desc", h.UpdateFlashcardSetDescription)
			// r.Delete("/", h.DeleteFlashCardSet)
		})
	})

	// CreateUser and GetUserBy{Email,Username} are called from the unprotected routes
	r.Route("/users", func(r chi.Router) {
		r.Get("/list", h.ListUsers)
		r.Get("/", h.GetUserById)
		r.Put("/username", h.UpdateUser)
		r.Put("/email", h.UpdateUser)
		r.Put("/firstname", h.UpdateUser)
		r.Put("/lastname", h.UpdateUser)
		r.Put("/password", h.UpdateUser)
		r.Delete("/", h.DeleteUser)
	})
}

func Unprotected(r *chi.Mux, h *controllers.Handler) {
	r.Post("/login", h.Login)
	r.Post("/signup", h.Signup)
}
