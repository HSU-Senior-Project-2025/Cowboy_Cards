-- name: AddSetToClass :exec
INSERT INTO class_set (class_id,set_id) VALUES ($1, $2);

-- name: RemoveSetFromClass :exec
DELETE FROM class_set WHERE class_id = $1 AND set_id = $2;

-- name: ListSetsInClass :many
SELECT flashcard_sets.id, set_name, set_description FROM flashcard_sets 
JOIN class_set ON flashcard_sets.id = class_set.set_id 
JOIN classes ON class_set.class_id = classes.id
WHERE class_id = $1 ORDER BY set_name;

-- name: ListClassesHavingSet :many
SELECT classes.id, class_name, class_description FROM classes
JOIN class_set ON classes.id = class_set.class_id 
JOIN flashcard_sets ON class_set.set_id = flashcard_sets.id
WHERE set_id = $1 ORDER BY class_name;