-- name: AddSet :exec
INSERT INTO class_set (class_id,set_id) VALUES ($1, $2);

-- name: RemoveSet :exec
DELETE FROM class_set WHERE class_id = $1 AND set_id = $2;

-- name: GetSetsInClass :many
SELECT flashcard_sets.id, set_name, set_description FROM classes
JOIN class_set ON classes.id = class_set.class_id 
JOIN flashcard_sets ON class_set.set_id = flashcard_sets.id
WHERE class_id = $1;

-- name: GetClassesHavingSet :many
SELECT classes.id, class_name, class_description FROM classes
JOIN class_set ON classes.id = class_set.class_id 
JOIN flashcard_sets ON class_set.set_id = flashcard_sets.id
WHERE set_id = $1;