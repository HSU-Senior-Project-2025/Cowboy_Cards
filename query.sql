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

-- name: GetUsers :many
SELECT id, username, email, password, first_name, last_name, created_at, updated_at FROM users;

-- name: GetUser :one
SELECT id, username, email, password, first_name, last_name, created_at, updated_at 
FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT id, username, email, password, first_name, last_name, created_at, updated_at 
FROM users WHERE email = $1 LIMIT 1;

-- name: GetUserByUsername :one
SELECT id, username, email, password, first_name, last_name, created_at, updated_at 
FROM users WHERE username = $1 LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (username, email, password, first_name, last_name)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, username, email, password, first_name, last_name, created_at, updated_at;

-- name: UpdateUserPassword :exec
UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2;