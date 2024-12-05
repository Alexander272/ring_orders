package models

import "time"

type Order struct {
	Id             string    `json:"id" db:"id"`
	Count          int       `json:"count" db:"count"`
	OrderNumber    string    `json:"orderNumber" db:"order_number"`
	Notes          string    `json:"notes" db:"notes"`
	DateOfIssue    int       `json:"dateOfIssue" db:"date_of_issue"`
	DateOfDispatch int       `json:"dateOfDispatch" db:"date_of_dispatch"`
	ClosingDate    int       `json:"closingDate" db:"closing_date"`
	Urgent         bool      `json:"urgent" db:"urgent"`
	Status         string    `json:"status" db:"status"`
	UpdatedAt      time.Time `json:"updatedAt" db:"updated_at"`
	CreatedAt      time.Time `json:"createdAt" db:"created_at"`
}

type GetOrderDTO struct {
	Page    *Page
	Sort    []*Sort
	Filters []*Filter
}

type OrderDTO struct {
	Id             string    `json:"id" db:"id"`
	OrderNumber    string    `json:"orderNumber" binding:"required"`
	Notes          string    `json:"notes"`
	DateOfIssue    int       `json:"dateOfIssue" binding:"required"`
	DateOfDispatch int       `json:"dateOfDispatch"`
	ClosingDate    int       `json:"closingDate"`
	Urgent         bool      `json:"urgent"`
	Status         string    `json:"status"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type DeleteOrderDTO struct {
	Id string `json:"id" binding:"required"`
}
