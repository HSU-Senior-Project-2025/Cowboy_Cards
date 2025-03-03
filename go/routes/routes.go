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
	//r.Get("/flashcard_sets", cfg.GetUsersFlashCardSets)
	//r.Delete("/flashcard_sets/{id}", cfg.DeleteFlashCardSets)
	r.Route("/flashcard_sets", func(r chi.Router) {
		r.Get("/", cfg.GetUsersFlashCardSets)
		r.Delete("/{id}", cfg.DeleteFlashCardSets)
	})
	r.Post("/flashcard", cfg.CreateFlashCard)
	r.Get("/flashcard/{id}", cfg.GetFlashCard)
	r.Put("/flashcard/{id}", cfg.UpdateFlashCard)
	r.Delete("/flashcard/{id}", cfg.DeleteFlashCard)
	// r.Get("/users", cfg.GetUsers)
	// r.Get("/user", cfg.GetUser)

}
