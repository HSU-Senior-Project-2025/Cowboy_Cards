package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Routes(r *chi.Mux, cfg *controllers.Config) {
	// Mount all routes under /api
	r.Route("/api", func(r chi.Router) {
		// r.Use(cfg.AuthMiddleware)

		// Auth routes
		r.Route("/auth", func(r chi.Router) {
			r.Post("/signup", cfg.Signup)
			r.Post("/login", cfg.Login)
		})

		r.Route("/user", func(r chi.Router) {
			r.Use(cfg.AuthMiddleware)
			r.Get("/", cfg.GetUser)
			r.Put("/", cfg.UpdateUser)
			r.Delete("/", cfg.DeleteUser)
		})

		r.Get("/users", cfg.GetUsers)

		r.Route("/class", func(r chi.Router) {
			r.Post("/", cfg.CreateClass)
			r.Get("/", cfg.GetClass)
			r.Put("/", cfg.UpdateClass)
			r.Delete("/", cfg.DeleteClass)
		})

		r.Get("/classes", cfg.GetClasses)

		r.Route("/flashcard", func(r chi.Router) {
			r.Post("/", cfg.CreateFlashCard)
			r.Get("/", cfg.GetFlashCard)
			r.Put("/", cfg.UpdateFlashCard)
			r.Delete("/", cfg.DeleteFlashCard)
		})

		r.Route("/flashcard_set", func(r chi.Router) {
			r.Post("/", cfg.CreateFlashCardSet)
			r.Get("/", cfg.GetFlashCardSet)
			r.Put("/", cfg.UpdateFlashCardSet)
			r.Delete("/", cfg.DeleteFlashCardSet)
		})
	})
}
