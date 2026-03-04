package models

import "time"

type GetPositionStatsDTO struct {
	PeriodStart time.Time `json:"periodStart"`
	PeriodEnd   time.Time `json:"periodEnd"`
}

type PositionStats struct {
	Name       string  `json:"name" db:"name"`
	Year       float64 `json:"year" db:"year"`
	TotalCount int     `json:"totalCount" db:"total_count"`
}
