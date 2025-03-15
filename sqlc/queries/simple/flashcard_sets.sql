-- name: GetFlashcardSetById :one
SELECT * FROM flashcard_sets WHERE id = $1;

-- name: CreateFlashcardSet :exec
INSERT INTO flashcard_sets (name, description) VALUES ($1, $2);

-- name: UpdateFlashcardSet :exec
UPDATE flashcard_sets SET name = $1, description = $2, updated_at = NOW() WHERE id = $3;

-- name: DeleteFlashcardSet :exec
DELETE FROM flashcard_sets WHERE id = $1;


-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

