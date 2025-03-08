package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Routes(r *chi.Mux, cfg *controllers.Config) {
	r.Route("/api", func(r chi.Router) {

		r.Get("/classes", cfg.GetClasses)
		r.Get("/users", cfg.GetUsers)

		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", cfg.Signup)
			r.Post("/login", cfg.Login)
		})

		r.Route("/user", func(r chi.Router) {
			r.Get("/", cfg.GetUser)
			r.Put("/", cfg.UpdateUser)
			r.Delete("/", cfg.DeleteUser)
		})

		r.Route("/class", func(r chi.Router) {
			r.Get("/", cfg.GetClass)
			r.Post("/", cfg.CreateClass)
			r.Put("/", cfg.UpdateClass)
			r.Delete("/", cfg.DeleteClass)
		})

		r.Route("/flashcard", func(r chi.Router) {
			r.Get("/", cfg.GetFlashCard)
			r.Post("/", cfg.CreateFlashCard)
			r.Put("/", cfg.UpdateFlashCard)
			r.Delete("/", cfg.DeleteFlashCard)

			r.Route("/set", func(r chi.Router) {
				r.Get("/", cfg.GetFlashCardSet)
				r.Post("/", cfg.CreateFlashCardSet)
				r.Put("/", cfg.UpdateFlashCardSet)
				r.Delete("/", cfg.DeleteFlashCardSet)
			})
		})
	})
}
