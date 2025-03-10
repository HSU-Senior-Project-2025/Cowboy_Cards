-- name: GetAllClasses :many
SELECT * FROM classes;

-- name: GetClassById :one
SELECT * FROM classes WHERE id = $1;

-- name: CreateClass :execresult
INSERT INTO classes (name, description, join_code, teacher_id) VALUES ($1, $2, $3, $4);

-- name: UpdateClass :execresult
UPDATE classes SET 
    name = CASE WHEN $1 = '' THEN name ELSE $1 END, 
    description = CASE WHEN $2 = '' THEN description ELSE $2 END, 
    join_code = CASE WHEN $3 = '' THEN join_code ELSE $3 END, 
    teacher_id = CASE WHEN $4 = '' THEN teacher_id ELSE $4 END, 
    updated_at = NOW() WHERE id = $5;

-- name: DeleteClass :execresult
DELETE FROM classes WHERE id = $1;
