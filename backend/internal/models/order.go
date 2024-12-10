package models

import "time"

type Order struct {
	Id             string    `json:"id" db:"id"`
	Count          int       `json:"count" db:"count"`
	OrderNumber    string    `json:"orderNumber" db:"order_number"`
	Notes          string    `json:"notes" db:"notes"`
	DateOfIssue    int       `json:"dateOfIssue" db:"date_of_issue"`
	DateOfDispatch int       `json:"dateOfDispatch" db:"date_of_dispatch"`
	DateOfAdoption int       `json:"dateOfAdoption" db:"date_of_adoption"`
	ClosingDate    int       `json:"closingDate" db:"closing_date"`
	Urgent         bool      `json:"urgent" db:"urgent"`
	Status         string    `json:"status" db:"status"`
	UpdatedAt      time.Time `json:"updatedAt" db:"updated_at"`
	CreatedAt      time.Time `json:"createdAt" db:"created_at"`
	Total          int       `json:"-" db:"total_count"`
}

type ImportantOrders struct {
	Urgent  int `json:"urgent" db:"urgent"`
	Overdue int `json:"overdue" db:"overdue"`
	Nearest int `json:"nearest" db:"nearest"`
}

type GetOrderDTO struct {
	Page    *Page
	Sort    []*Sort
	Filters []*Filter
}

type CreateOrderDTO struct {
	Id             string               `json:"id" db:"id"`
	OrderNumber    string               `json:"orderNumber" db:"order_number" binding:"required"`
	Notes          string               `json:"notes" db:"notes"`
	DateOfIssue    int                  `json:"dateOfIssue" db:"date_of_issue" binding:"required"`
	DateOfDispatch int                  `json:"dateOfDispatch" db:"date_of_dispatch"`
	Urgent         bool                 `json:"urgent" db:"urgent"`
	Status         string               `json:"status" db:"status"`
	Positions      []*CreatePositionDTO `json:"positions" binding:"required"`
}

type OrderDTO struct {
	Id             string    `json:"id" db:"id"`
	OrderNumber    string    `json:"orderNumber" db:"order_number" binding:"required"`
	Notes          string    `json:"notes" db:"notes"`
	DateOfIssue    int       `json:"dateOfIssue" db:"date_of_issue" binding:"required"`
	DateOfDispatch int       `json:"dateOfDispatch" db:"date_of_dispatch"`
	DateOfAdoption int       `json:"dateOfAdoption" db:"date_of_adoption"`
	ClosingDate    int       `json:"closingDate" db:"closing_date"`
	Urgent         bool      `json:"urgent" db:"urgent"`
	Status         string    `json:"status" db:"status"`
	UpdatedAt      time.Time `json:"updatedAt" db:"updated_at"`
}

type DeleteOrderDTO struct {
	Id string `json:"id" binding:"required"`
}
