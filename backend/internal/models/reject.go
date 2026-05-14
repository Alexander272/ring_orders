package models

import "time"

type Reject struct {
	Id         string    `json:"id" db:"id"`
	PositionId string    `json:"positionId" db:"position_id"`
	Date       int       `json:"date" db:"date"`
	Amount     int       `json:"amount" db:"amount"`
	Note       string    `json:"note" db:"note"`
	UpdatedAt  time.Time `json:"updatedAt" db:"updated_at"`
	CreatedAt  time.Time `json:"createdAt" db:"created_at"`
}

type GetRejectDTO struct {
	PositionId string `json:"positionId" db:"position_id"`
}

type RejectDTO struct {
	Id         string `json:"id" db:"id"`
	PositionId string `json:"positionId" db:"position_id" binding:"required"`
	Date       int    `json:"date" db:"date"`
	Amount     int    `json:"amount" db:"amount" binding:"required,gt=0"`
	Note       string `json:"note" db:"note"`
}

type DeleteRejectDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
