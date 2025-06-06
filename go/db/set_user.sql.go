// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.29.0
// source: set_user.sql

package db

import (
	"context"
)

const getTotalScore = `-- name: GetTotalScore :one
SELECT COALESCE(SUM(set_score), 0) FROM set_user WHERE user_id = $1
`

func (q *Queries) GetTotalScore(ctx context.Context, userID int32) (interface{}, error) {
	row := q.db.QueryRow(ctx, getTotalScore, userID)
	var coalesce interface{}
	err := row.Scan(&coalesce)
	return coalesce, err
}

const joinSet = `-- name: JoinSet :exec
INSERT INTO set_user (user_id, set_id, role) VALUES ($1, $2, $3)
`

type JoinSetParams struct {
	UserID int32
	SetID  int32
	Role   string
}

func (q *Queries) JoinSet(ctx context.Context, arg JoinSetParams) error {
	_, err := q.db.Exec(ctx, joinSet, arg.UserID, arg.SetID, arg.Role)
	return err
}

const leaveSet = `-- name: LeaveSet :exec
DELETE FROM set_user WHERE user_id = $1 AND set_id = $2
`

type LeaveSetParams struct {
	UserID int32
	SetID  int32
}

func (q *Queries) LeaveSet(ctx context.Context, arg LeaveSetParams) error {
	_, err := q.db.Exec(ctx, leaveSet, arg.UserID, arg.SetID)
	return err
}

const listSetsOfAUser = `-- name: ListSetsOfAUser :many
SELECT set_id, role, set_name, set_description FROM set_user JOIN flashcard_sets ON set_user.set_id = flashcard_sets.id WHERE user_id = $1 ORDER BY set_name
`

type ListSetsOfAUserRow struct {
	SetID          int32
	Role           string
	SetName        string
	SetDescription string
}

func (q *Queries) ListSetsOfAUser(ctx context.Context, userID int32) ([]ListSetsOfAUserRow, error) {
	rows, err := q.db.Query(ctx, listSetsOfAUser, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []ListSetsOfAUserRow
	for rows.Next() {
		var i ListSetsOfAUserRow
		if err := rows.Scan(
			&i.SetID,
			&i.Role,
			&i.SetName,
			&i.SetDescription,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateSetScore = `-- name: UpdateSetScore :exec
INSERT INTO set_user (user_id, set_id, role, set_score) VALUES ($1, $2, 'user', 1)
ON CONFLICT (user_id, set_id)
DO UPDATE SET set_score = (set_user.set_score + 1) 
WHERE set_user.user_id = $1 AND set_user.set_id = $2
`

type UpdateSetScoreParams struct {
	UserID int32
	SetID  int32
}

func (q *Queries) UpdateSetScore(ctx context.Context, arg UpdateSetScoreParams) error {
	_, err := q.db.Exec(ctx, updateSetScore, arg.UserID, arg.SetID)
	return err
}
