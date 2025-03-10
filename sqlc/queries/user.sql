-- name: GetUser :one
SELECT * FROM users WHERE id = $1;

-- name: UpdateUser :execresult
UPDATE users SET username = $1, email = $2, first_name = $3, last_name = $4, updated_at = NOW() WHERE id = $5;

-- name: DeleteUser :execresult
DELETE FROM users WHERE id = $1;