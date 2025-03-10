-- name: GetFlashCard :one
SELECT * FROM flashcards WHERE id = $1;

-- name: CreateFlashCard :execresult
INSERT INTO flashcards (front, back, set_id) VALUES ($1, $2, $3);

-- name: UpdateFlashCard :execresult
UPDATE flashcards SET front = $1, back = $2, updated_at = NOW() WHERE id = $3;

-- name: DeleteFlashCard :execresult
DELETE FROM flashcards WHERE id = $1;