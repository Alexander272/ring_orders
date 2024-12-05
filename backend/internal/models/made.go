package models

import "time"

type Made struct {
	Id         string `json:"id" db:"id"`
	PositionId string `json:"positionId" db:"position_id"`
	// Count      int       `json:"count" db:"count"`
	// Name       string    `json:"name" db:"name"`
	// Note       string    `json:"note" db:"note"`
	Date      int       `json:"date" db:"date"`
	Amount    int       `json:"amount" db:"amount"`
	Note      string    `json:"note" db:"note"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
}

type GetMadeDTO struct {
	PositionId string `json:"positionId" db:"position_id"`
}

type MadeDTO struct {
	Id         string `json:"id" db:"id"`
	PositionId string `json:"positionId" db:"position_id" binding:"required"`
	Date       int    `json:"date" db:"date"`
	Amount     int    `json:"amount" db:"amount" binding:"required"`
	Note       string `json:"note" db:"note"`
}

type DeleteMadeDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
