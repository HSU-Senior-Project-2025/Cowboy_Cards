package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Routes(r *chi.Mux, cfg *controllers.Config) {

	r.Get("/classes", cfg.GetClasses)

	r.Route("/flashcard_set", func(r chi.Router) {
		r.Get("/", cfg.GetUsersFlashCardSet)
    r.Post("/", cfg.CreateFlashCardSet)
	  r.Put("/", cfg.UpdateFlashCardSet)
		r.Delete("/", cfg.DeleteFlashCardSet)
	})

	r.Get("/flashcard", cfg.GetFlashCard)
	r.Post("/flashcard", cfg.CreateFlashCard)
	r.Put("/flashcard", cfg.UpdateFlashCard)
	r.Delete("/flashcard", cfg.DeleteFlashCard)

	r.Get("/users", cfg.GetUsers)
	r.Get("/user", cfg.GetUser)

}
