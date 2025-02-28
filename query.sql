-- name: GetClasses :many
SELECT * FROM classes;

-- name: GetUsersFlashCardSets :many
SELECT * FROM flashcard_sets WHERE user_id = $1;

-- name: CreateFlashCard :exec
INSERT INTO flashcards (front, back, set_id, user_id) VALUES ($1, $2, $3, $4);
-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;