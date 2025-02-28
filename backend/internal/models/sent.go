package models

import "time"

type Sent struct {
	Id         string    `json:"id" db:"id"`
	PositionId string    `json:"positionId" db:"position_id"`
	Date       int       `json:"date" db:"date"`
	Quantity   int       `json:"quantity" db:"quantity"`
	Note       string    `json:"note" db:"note"`
	UpdatedAt  time.Time `json:"updatedAt" db:"updated_at"`
	CreatedAt  time.Time `json:"createdAt" db:"created_at"`
}

type GetSentDTO struct {
	PositionId string `json:"positionId" db:"position_id"`
}

type SentDTO struct {
	Id         string `json:"id" db:"id"`
	PositionId string `json:"positionId" db:"position_id" binding:"required"`
	Date       int    `json:"date" db:"date"`
	Quantity   int    `json:"quantity" db:"quantity" binding:"required,gt=0"`
	Note       string `json:"note" db:"note"`
}

type DeleteSentDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
