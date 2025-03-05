package routes

import (
	"github.com/HSU-Senior-Project-2025/Cowboy_Cards/go/controllers"
	"github.com/go-chi/chi/v5"
)

func Routes(r *chi.Mux, cfg *controllers.Config) {
	// r.Get("/", func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte("hello world\n"))
	// })
	r.Get("/classes", cfg.GetClasses)

	// r.Get("/flashcard_sets", cfg.GetUsersFlashCardSets)
	r.Route("/flashcard_set", func(r chi.Router) {
		r.Post("/", cfg.CreateFlashCardSet)
		r.Get("/", cfg.GetFlashCardSet)
		r.Put("/", cfg.UpdateFlashCardSet)
		r.Delete("/", cfg.DeleteFlashCardSet)
	})

	r.Route("/flashcard", func(r chi.Router) {
		r.Post("/", cfg.CreateFlashCard)
		r.Get("/", cfg.GetFlashCard)
		r.Put("/", cfg.UpdateFlashCard)
		r.Delete("/", cfg.DeleteFlashCard)
	})

	r.Get("/users", cfg.GetUsers)
	r.Get("/user", cfg.GetUser)

}
