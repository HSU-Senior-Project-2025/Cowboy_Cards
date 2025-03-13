package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Routes(r *chi.Mux, h *controllers.Handler) {
	r.Route("/api", func(r chi.Router) {

		r.Get("/classes", h.GetClasses)
		r.Get("/users", h.GetUsers)

		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", h.Login)
			r.Post("/signup", h.Signup)
		})

		r.Route("/user", func(r chi.Router) {
			r.Get("/", h.GetUser)
			r.Put("/", h.UpdateUser)
			r.Delete("/", h.DeleteUser)
		})

		r.Route("/class", func(r chi.Router) {
			r.Get("/", h.GetClass)
			r.Post("/", h.CreateClass)
			r.Put("/", h.UpdateClass)
			r.Delete("/", h.DeleteClass)
		})

		r.Route("/flashcard", func(r chi.Router) {
			r.Get("/", h.GetFlashCard)
			r.Post("/", h.CreateFlashCard)
			r.Put("/", h.UpdateFlashCard)
			r.Delete("/", h.DeleteFlashCard)

			r.Route("/set", func(r chi.Router) {
				r.Get("/", h.GetFlashCardSet)
				r.Post("/", h.CreateFlashCardSet)
				r.Put("/", h.UpdateFlashCardSet)
				r.Delete("/", h.DeleteFlashCardSet)
			})
		})
	})
}
