-- name: JoinClass :exec
INSERT INTO class_user (user_id, class_id, role) VALUES ($1, $2, $3);

-- name: LeaveClass :exec
DELETE FROM class_user WHERE user_id = $1 AND class_id = $2;

-- name: ListClassesOfAUser :many
SELECT class_id, role, class_name FROM class_user JOIN classes ON class_user.class_id = classes.id WHERE user_id = $1;

-- name: ListMembersOfAClass :many
SELECT user_id, class_id, role, first_name, last_name FROM class_user JOIN users ON class_user.user_id = users.id WHERE class_id = $1;





-- name: ListStudentsOfAClass :many
-- SELECT user_id, class_id, role, first_name, last_name
-- FROM class_user JOIN users ON class_user.user_id = users.id
-- WHERE class_id = $1 AND role = 'student';

-- name: ListTeachersOfAClass :many
SELECT user_id, class_id, role, first_name, last_name
FROM class_user JOIN users ON class_user.user_id = users.id
WHERE class_id = $1 AND role = 'teacher';