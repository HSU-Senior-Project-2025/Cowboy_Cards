-- name: ListClasses :many
SELECT * FROM classes ORDER BY class_name;

-- name: GetClassById :one
SELECT * FROM classes WHERE id = $1;

-- name: CreateClass :exec
INSERT INTO classes (class_name, class_description, join_code) VALUES ($1, $2, $3);

-- name: UpdateClassName :one
UPDATE classes SET class_name = $1, updated_at = NOW() WHERE id = $2 RETURNING class_name;

-- name: UpdateClassDescription :one
UPDATE classes SET class_description = $1, updated_at = NOW() WHERE id = $2 RETURNING class_description;

-- name: DeleteClass :exec
DELETE FROM classes WHERE id = $1;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

-- update join code deliberately omitted
