-- name: GetClasses :many
SELECT * FROM classes;

-- name: GetFlashCardSet :one
SELECT * FROM flashcard_sets WHERE id = $1;

-- name: CreateFlashCardSet :exec
INSERT INTO flashcard_sets (id, name, description) VALUES ($1, $2, $3);

-- name: UpdateFlashCardSet :exec
UPDATE flashcard_sets SET name = $1, description = $2 WHERE id = $3;

-- name: DeleteFlashCardSet :exec
DELETE FROM flashcard_sets WHERE id = $1;

-- name: CreateFlashCard :exec
INSERT INTO flashcards (front, back, set_id) VALUES ($1, $2, $3);

-- name: GetFlashCard :one
SELECT * FROM flashcards WHERE id = $1;

-- name: UpdateFlashCard :exec
UPDATE flashcards SET front = $1, back = $2 WHERE id = $3;

-- name: DeleteFlashCard :exec
DELETE FROM flashcards WHERE id = $1;

-- name: DeleteFlashCardSet :exec
DELETE FROM flashcard_sets WHERE id = $1 AND user_id = $2;

-- name: GetUsers :many
SELECT * FROM users;

-- name: GetUser :one
SELECT * FROM users WHERE id = $1;