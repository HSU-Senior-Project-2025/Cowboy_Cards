-- name: GetClasses :many
SELECT * FROM classes;

-- name: GetUsersFlashCardSets :many
SELECT * FROM flashcard_sets WHERE user_id = $1;

-- name: CreateFlashCard :exec
INSERT INTO flashcards (front, back, set_id, user_id) VALUES ($1, $2, $3, $4);

-- name: GetFlashCard :one
SELECT * FROM flashcards WHERE id = $1;

-- name: UpdateFlashCard :exec
UPDATE flashcards SET front = $1, back = $2 WHERE id = $3;

-- name: DeleteFlashCard :exec
DELETE FROM flashcards WHERE id = $1;

-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;