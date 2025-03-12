package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Routes(r *chi.Mux, pool *controllers.Pool) {
	r.Route("/api", func(r chi.Router) {

		r.Get("/classes", pool.GetClasses)
		r.Get("/users", pool.GetUsers)

		r.Route("/auth", func(r chi.Router) {
			r.Post("/login", pool.Login)
			r.Post("/signup", pool.Signup)
		})

		r.Route("/user", func(r chi.Router) {
			r.Get("/", pool.GetUser)
			r.Put("/", pool.UpdateUser)
			r.Delete("/", pool.DeleteUser)
		})

		r.Route("/class", func(r chi.Router) {
			r.Get("/", pool.GetClass)
			r.Post("/", pool.CreateClass)
			r.Put("/", pool.UpdateClass)
			r.Delete("/", pool.DeleteClass)
		})

		r.Route("/flashcard", func(r chi.Router) {
			r.Get("/", pool.GetFlashCard)
			r.Post("/", pool.CreateFlashCard)
			r.Put("/", pool.UpdateFlashCard)
			r.Delete("/", pool.DeleteFlashCard)

			r.Route("/set", func(r chi.Router) {
				r.Get("/", pool.GetFlashCardSet)
				r.Post("/", pool.CreateFlashCardSet)
				r.Put("/", pool.UpdateFlashCardSet)
				r.Delete("/", pool.DeleteFlashCardSet)
			})
		})
	})
}
