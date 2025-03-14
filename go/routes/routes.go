package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Protected(r *chi.Mux, h *controllers.Handler) {

	r.Route("/users", func(r chi.Router) {
		r.Get("/list", h.ListUsers)
		r.Get("/", h.GetUser)
		r.Put("/", h.UpdateUser)
		r.Delete("/", h.DeleteUser)
	})

	r.Route("/classes", func(r chi.Router) {
		r.Get("/list", h.ListClasses)
		r.Get("/", h.GetClass)
		r.Post("/", h.CreateClass)
		r.Put("/", h.UpdateClass)
		r.Delete("/", h.DeleteClass)
	})

	r.Route("/flashcards", func(r chi.Router) {
		r.Get("/", h.GetFlashCard)
		r.Post("/", h.CreateFlashCard)
		r.Put("/", h.UpdateFlashCard)
		r.Delete("/", h.DeleteFlashCard)

		r.Route("/sets", func(r chi.Router) {
			r.Get("/", h.GetFlashCardSet)
			r.Post("/", h.CreateFlashCardSet)
			r.Put("/", h.UpdateFlashCardSet)
			r.Delete("/", h.DeleteFlashCardSet)
		})
	})
}

func Unprotected(r *chi.Mux, h *controllers.Handler) {

	r.Post("/login", h.Login)
	r.Post("/signup", h.Signup)

}
