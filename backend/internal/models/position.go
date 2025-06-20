package models

import "time"

type Position struct {
	Id string `json:"id" db:"id"`
	// OrderId    string    `json:"orderId" db:"order_id"`
	Count      int       `json:"count" db:"count"`
	Name       string    `json:"name" db:"name"`
	Note       string    `json:"note" db:"note"`
	Amount     int       `json:"amount" db:"amount"`
	Made       int       `json:"made" db:"made"`
	Accepted   int       `json:"accepted" db:"accepted"`
	Sent       int       `json:"sent" db:"sent"`
	IsDeleted  bool      `json:"isDeleted" db:"is_deleted"`
	IsDone     bool      `json:"isDone" db:"is_done"`
	IsAccepted bool      `json:"isAccepted" db:"is_accepted"`
	IsSent     bool      `json:"isSent" db:"is_sent"`
	UpdatedAt  time.Time `json:"updatedAt" db:"updated_at"`
	CreatedAt  time.Time `json:"createdAt" db:"created_at"`
}

type GetPositionDTO struct {
	OrderId string `json:"orderId"`
	Sort    string `json:"sort"`
}

type GetPositionByIdDTO struct {
	Id string `json:"id" db:"id"`
}

type CreatePositionDTO struct {
	Id      string `json:"id" db:"id"`
	OrderId string `json:"orderId" db:"order_id"`
	Count   int    `json:"count" db:"count"`
	Name    string `json:"name" db:"name"`
	Note    string `json:"note" db:"note"`
	Amount  int    `json:"amount" db:"amount"`
}

type UpdatePositionDTO struct {
	Id        string `json:"id" db:"id"`
	Note      string `json:"note" db:"note"`
	Amount    int    `json:"amount" db:"amount"`
	IsDeleted bool   `json:"isDeleted" db:"is_deleted"`
}
