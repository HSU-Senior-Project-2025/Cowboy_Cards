-- name: GetAllUsers :many
SELECT * FROM users;

-- name: GetUserById :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = $1;

-- name: GetUserByUsername :one
SELECT * FROM users WHERE username = $1;

-- name: CreateUser :execresult
INSERT INTO users (username, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5);

-- name: UpdateUser :execresult
UPDATE users SET 
    username = CASE WHEN $1 = '' THEN username ELSE $1 END, 
    first_name = CASE WHEN $2 = '' THEN first_name ELSE $2 END, 
    last_name = CASE WHEN $3 = '' THEN last_name ELSE $3 END, 
    email = CASE WHEN $4 = '' THEN email ELSE $4 END, 
    password = CASE WHEN $5 = '' THEN password ELSE $5 END, 
    updated_at = NOW() WHERE id = $6;

-- name: DeleteUser :execresult
DELETE FROM users WHERE id = $1;
