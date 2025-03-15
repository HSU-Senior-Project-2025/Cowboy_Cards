-- name: GetFlashcardById :one
SELECT * FROM flashcards WHERE id = $1;

-- name: CreateFlashcard :exec
INSERT INTO flashcards (front, back, set_id) VALUES ($1, $2, $3);

-- name: UpdateFlashcard :exec
UPDATE flashcards SET front = $1, back = $2, set_id = $3, updated_at = NOW() WHERE id = $4;

-- name: DeleteFlashcard :exec
DELETE FROM flashcards WHERE id = $1;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

