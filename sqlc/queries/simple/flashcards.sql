-- name: GetFlashcardById :one
SELECT * FROM flashcards WHERE id = $1;

-- name: CreateFlashcard :exec
INSERT INTO flashcards (front, back, set_id) VALUES ($1, $2, $3);

-- name: UpdateFlashcardFront :one
UPDATE flashcards SET front = $1, updated_at = NOW() WHERE id = $2 RETURNING front;

-- name: UpdateFlashcardBack :one
UPDATE flashcards SET back = $1, updated_at = NOW() WHERE id = $2 RETURNING back;

-- name: UpdateFlashcardSetId :one
UPDATE flashcards SET set_id = $1, updated_at = NOW() WHERE id = $2 RETURNING set_id;

-- name: DeleteFlashcard :exec
DELETE FROM flashcards WHERE id = $1;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

