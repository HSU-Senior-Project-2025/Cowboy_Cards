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
	r.Get("/flashcard_sets", cfg.GetUsersFlashCardSets)
	r.Post("/flashcard", cfg.CreateFlashCard)
	r.Get("/flashcard", cfg.GetFlashCard)
	r.Put("/flashcard", cfg.UpdateFlashCard)
	r.Delete("/flashcard", cfg.DeleteFlashCard)
	r.Get("/users", cfg.GetUsers)
	r.Get("/user", cfg.GetUser)

}
