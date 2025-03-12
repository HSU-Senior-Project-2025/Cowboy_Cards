-- name: GetFlashcardById :one
SELECT * FROM flashcards WHERE id = $1;

-- name: CreateFlashcard :execresult
INSERT INTO flashcards (front, back, set_id) VALUES ($1, $2, $3);

-- name: UpdateFlashcard :execresult
UPDATE flashcards SET front = $1, back = $2, set_id = $3, updated_at = NOW() WHERE id = $4;

-- name: DeleteFlashcard :execresult
DELETE FROM flashcards WHERE id = $1;
