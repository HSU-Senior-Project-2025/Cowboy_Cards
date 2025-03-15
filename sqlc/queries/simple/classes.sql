-- name: ListClasses :many
SELECT * FROM classes ORDER BY name;

-- name: GetClassById :one
SELECT * FROM classes WHERE id = $1;

-- name: CreateClass :exec
INSERT INTO classes (name, description, join_code, teacher_id) VALUES ($1, $2, $3, $4);

-- name: UpdateClass :exec
UPDATE classes SET name = $1, description = $2, join_code = $3, teacher_id = $4, updated_at = NOW() WHERE id = $5;

-- name: DeleteClass :exec
DELETE FROM classes WHERE id = $1;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

