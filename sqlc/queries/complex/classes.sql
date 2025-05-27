-- name: GetClassLeaderboard :many
SELECT class_user.user_id, users.first_name, users.last_name, users.username, COALESCE(SUM(set_score),0) AS class_score FROM classes 
JOIN class_user ON classes.id = class_user.class_id 
JOIN class_set ON classes.id = class_set.class_id
JOIN set_user ON (class_user.user_id = set_user.user_id AND class_set.set_id = set_user.set_id)
JOIN users ON class_user.user_id = users.id
WHERE classes.id = $1
GROUP BY class_user.user_id, users.first_name, users.last_name, users.username
ORDER BY COALESCE(SUM(set_score),0) DESC;