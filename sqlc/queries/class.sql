-- name: GetClass :one
SELECT * FROM classes WHERE id = $1;

-- name: CreateClass :execresult
INSERT INTO classes (name, description, join_code, teacher_id) VALUES ($1, $2, $3, $4);

-- name: UpdateClass :execresult
UPDATE classes SET name = $1, description = $2, join_code = $3, teacher_id = $4, updated_at = NOW() WHERE id = $5;

-- name: DeleteClass :execresult
DELETE FROM classes WHERE id = $1;