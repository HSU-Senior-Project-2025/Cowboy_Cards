-- name: ListUsers :many
SELECT id, username, first_name, last_name, email, created_at, updated_at FROM users ORDER BY last_name, first_name;

-- name: GetUserById :one
SELECT id, username, first_name, last_name, email, login_streak, created_at, updated_at FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT id, username, first_name, last_name, email, created_at, updated_at FROM users WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *;

-- name: UpdateUsername :one
UPDATE users SET username = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING username;

-- name: UpdateEmail :one
UPDATE users SET email = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING email;

-- name: UpdateFirstname :one
UPDATE users SET first_name = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING first_name;

-- name: UpdateLastname :one
UPDATE users SET last_name = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING last_name;

-- name: UpdatePassword :exec
UPDATE users SET password = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2;

-- name: UpdateLastLogin :exec
UPDATE users SET last_login = CURRENT_DATE, updated_at = LOCALTIMESTAMP(2) WHERE id = $1;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = $1;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

