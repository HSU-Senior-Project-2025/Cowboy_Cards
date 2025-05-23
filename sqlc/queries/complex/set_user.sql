-- name: JoinSet :exec
INSERT INTO set_user (user_id, set_id, role) VALUES ($1, $2, $3);

-- name: UpdateSetScore :exec
INSERT INTO set_user (user_id, set_id, role, set_score) VALUES ($1, $2, 'user', 1)
ON CONFLICT (user_id, set_id)
DO UPDATE SET set_score = (set_user.set_score + 1) 
WHERE set_user.user_id = $1 AND set_user.set_id = $2;

-- name: LeaveSet :exec
DELETE FROM set_user WHERE user_id = $1 AND set_id = $2;

-- name: ListSetsOfAUser :many
SELECT set_id, role, set_name, set_description FROM set_user JOIN flashcard_sets ON set_user.set_id = flashcard_sets.id WHERE user_id = $1 ORDER BY set_name;

-- name: GetTotalScore :one
SELECT COALESCE(SUM(set_score), 0) FROM set_user WHERE user_id = $1;

