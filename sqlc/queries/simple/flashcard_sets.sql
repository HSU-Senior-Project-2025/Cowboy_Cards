-- name: GetFlashcardSetById :one
SELECT * FROM flashcard_sets WHERE id = $1;

-- name: CreateFlashcardSet :execresult
INSERT INTO flashcard_sets (name, description) VALUES ($1, $2);

-- name: UpdateFlashcardSet :execresult
UPDATE flashcard_sets SET name = $1, description = $2, updated_at = NOW() WHERE id = $3;

-- name: DeleteFlashcardSet :execresult
DELETE FROM flashcard_sets WHERE id = $1;
