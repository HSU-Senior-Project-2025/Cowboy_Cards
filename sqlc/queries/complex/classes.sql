-- name: GetClassScores :many
SELECT class_user.user_id, SUM(set_score) AS class_score FROM classes 
JOIN class_user ON classes.id = class_user.class_id 
JOIN class_set ON classes.id = class_set.class_id
JOIN set_user ON (class_user.user_id = set_user.user_id AND class_set.set_id = set_user.set_id)
WHERE classes.id = $1
GROUP BY class_user.user_id
ORDER BY SUM(set_score) DESC;