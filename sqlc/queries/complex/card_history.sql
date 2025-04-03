-- name: UpsertCorrectFlashcardScore :exec
INSERT INTO card_history (user_id, card_id, score) VALUES ($1, $2, 1) 
ON CONFLICT (user_id, card_id) DO 
UPDATE SET score = card_history.score + 1, times_attempted = card_history.times_attempted + 1;

-- name: UpsertIncorrectFlashcardScore :exec
INSERT INTO card_history (user_id, card_id, score) VALUES ($1, $2, 0) 
ON CONFLICT (user_id, card_id) DO 
UPDATE SET times_attempted = card_history.times_attempted + 1;

-- name: GetCardScore :one
SELECT score AS correct, (times_attempted - score) AS incorrect, (score - times_attempted) AS net_score, times_attempted FROM card_history
WHERE user_id = $1 AND card_id = $2;

-- name: GetScoresInASet :many
SELECT set_name, score AS correct, (times_attempted - score) AS incorrect, (score - times_attempted) AS net_score, times_attempted 
FROM card_history 
JOIN flashcards ON card_history.card_id = flashcards.id
JOIN flashcard_sets ON flashcards.set_id = flashcard_sets.id
WHERE user_id = $1 AND set_id = $2;
