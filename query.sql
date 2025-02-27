-- name: GetClasses :many
SELECT * FROM classes;

-- name: GetFlashCardSet :many
SELECT * FROM flashcard_sets WHERE user_id = $1;

-- name: GetUsers :many
-- SELECT * FROM users;

-- name: GetUser :one
-- SELECT * FROM users WHERE id = $1;