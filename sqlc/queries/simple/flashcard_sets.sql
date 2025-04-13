-- name: ListFlashcardSets :many
SELECT * FROM flashcard_sets ORDER BY set_name;

-- name: GetFlashcardSetById :one
SELECT * FROM flashcard_sets WHERE id = $1;

-- name: CreateFlashcardSet :one
INSERT INTO flashcard_sets (set_name, set_description) VALUES ($1, $2) RETURNING *;

-- name: UpdateFlashcardSetName :one
UPDATE flashcard_sets SET set_name = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING set_name;

-- name: UpdateFlashcardSetDescription :one
UPDATE flashcard_sets SET set_description = $1, updated_at = LOCALTIMESTAMP(2) WHERE id = $2 RETURNING set_description;

-- name: DeleteFlashcardSet :exec
DELETE FROM flashcard_sets WHERE id = $1;

-- name: VerifySetMember :one
SELECT * from set_user WHERE set_id = $1 AND user_id = $2;

-- execresult annotation is buggy, trying exec https://github.com/sqlc-dev/sqlc/issues/3699#issuecomment-2486892414

