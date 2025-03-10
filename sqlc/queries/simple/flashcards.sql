-- name: GetFlashcardById :one
SELECT * FROM flashcards WHERE id = $1;

-- name: CreateFlashcard :execresult
INSERT INTO flashcards (front, back, set_id) VALUES ($1, $2, $3);

-- name: UpdateFlashcard :execresult
UPDATE flashcards SET 
    front = CASE WHEN $1 = '' THEN front ELSE $1 END, 
    back = CASE WHEN $2 = '' THEN back ELSE $2 END, 
    set_id = CASE WHEN $3 = '' THEN set_id ELSE $3 END, 
    updated_at = NOW() WHERE id = $4;

-- name: DeleteFlashcard :execresult
DELETE FROM flashcards WHERE id = $1;
