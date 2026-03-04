package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type StatisticsRepo struct {
	db *sqlx.DB
}

func NewStatisticsRepo(db *sqlx.DB) *StatisticsRepo {
	return &StatisticsRepo{
		db: db,
	}
}

type Statistics interface {
	GetPosition(ctx context.Context, req *models.GetPositionStatsDTO) ([]*models.PositionStats, error)
}

func (r *StatisticsRepo) GetPosition(ctx context.Context, req *models.GetPositionStatsDTO) ([]*models.PositionStats, error) {
	condition := ""
	params := []interface{}{}
	if !req.PeriodStart.IsZero() {
		params = append(params, req.PeriodStart)
		condition += fmt.Sprintf(" AND created_at >= $%d", len(params))
	}
	if !req.PeriodEnd.IsZero() {
		params = append(params, req.PeriodEnd)
		condition += fmt.Sprintf(" AND created_at <= $%d", len(params))
	}

	query := fmt.Sprintf(`SELECT name, EXTRACT(YEAR FROM created_at) AS year, SUM(amount) AS total_count
		FROM %s
		WHERE is_deleted = false %s
		GROUP BY name, year
		ORDER BY year DESC, total_count DESC;`,
		PositionsTable, condition,
	)

	data := []*models.PositionStats{}

	if err := r.db.SelectContext(ctx, &data, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}
