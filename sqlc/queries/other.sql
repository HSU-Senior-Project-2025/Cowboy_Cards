-- name: GetClasses :many
SELECT * FROM classes;

-- name: GetUsers :many
SELECT * FROM users;


-- name: GetUsers :many
SELECT id, username, email, password, first_name, last_name, created_at, updated_at FROM users;


-- name: GetUserByEmail :one
SELECT id, username, email, password, first_name, last_name, created_at, updated_at 
FROM users WHERE email = $1 LIMIT 1;

-- name: GetUserByUsername :one
SELECT id, username, email, password, first_name, last_name, created_at, updated_at 
FROM users WHERE username = $1 LIMIT 1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: CreateUser :one
INSERT INTO users (username, email, password, first_name, last_name)
VALUES ($1, $2, $3, $4, $5)
RETURNING id, username, email, password, first_name, last_name, created_at, updated_at;

-- name: UpdateUserPassword :execresult
UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2;





