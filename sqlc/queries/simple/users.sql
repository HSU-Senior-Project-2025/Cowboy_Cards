-- name: ListUsers :many
SELECT * FROM users ORDER BY last_name, first_name;

-- name: GetUserById :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: UpdateUser :execresult
UPDATE users SET username = $1, first_name = $2, last_name = $3, email = $4, password = $5, updated_at = NOW() WHERE id = $6;

-- name: DeleteUser :execresult
DELETE FROM users WHERE id = $1;
