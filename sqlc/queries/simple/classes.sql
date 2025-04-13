-- name: ListClasses :many
SELECT * FROM classes ORDER BY class_name;

-- name: GetClassById :one
SELECT * FROM classes WHERE id = $1;

-- name: CreateClass :one
INSERT INTO classes (class_name, class_description) VALUES ($1, $2) RETURNING *;

-- name: UpdateClassName :one
UPDATE classes SET class_name = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING class_name;

-- name: UpdateClassDescription :one
UPDATE classes SET class_description = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING class_description;

-- name: DeleteClass :exec
DELETE FROM classes WHERE id = $1;

-- name: VerifyClassMember :one
SELECT * FROM class_user WHERE class_id = $1 AND user_id = $2;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

-- update join code deliberately omitted
