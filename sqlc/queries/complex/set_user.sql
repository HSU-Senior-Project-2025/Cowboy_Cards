-- name: JoinSet :exec
INSERT INTO set_user (user_id, set_id, role) VALUES ($1, $2, $3);

-- name: LeaveSet :exec
DELETE FROM set_user WHERE user_id = $1 AND set_id = $2;

-- name: ListSetsOfAUser :many
SELECT set_id, role, set_name, set_description FROM set_user JOIN flashcard_sets ON set_user.set_id = flashcard_sets.id WHERE user_id = $1 ORDER BY set_name;
