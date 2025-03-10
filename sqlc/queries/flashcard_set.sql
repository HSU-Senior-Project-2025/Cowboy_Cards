-- name: GetFlashCardSet :one
SELECT * FROM flashcard_sets WHERE id = $1;

-- name: CreateFlashCardSet :execresult
INSERT INTO flashcard_sets (id, name, description) VALUES ($1, $2, $3);

-- name: UpdateFlashCardSet :execresult
UPDATE flashcard_sets SET name = $1, description = $2, updated_at = NOW() WHERE id = $3;

-- name: DeleteFlashCardSet :execresult
DELETE FROM flashcard_sets WHERE id = $1;