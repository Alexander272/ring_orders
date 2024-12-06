package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type PositionRepo struct {
	db *sqlx.DB
}

func NewPositionRepo(db *sqlx.DB) *PositionRepo {
	return &PositionRepo{
		db: db,
	}
}

type Position interface {
	Get(ctx context.Context, req *models.GetPositionDTO) ([]*models.Position, error)
	Create(ctx context.Context, dto *models.CreatePositionDTO) error
	CreateSeveral(ctx context.Context, dto []*models.CreatePositionDTO) error
	Update(ctx context.Context, dto *models.UpdatePositionDTO) error
}

func (r *PositionRepo) Get(ctx context.Context, req *models.GetPositionDTO) ([]*models.Position, error) {
	query := fmt.Sprintf(`SELECT id, count, name, note, amount, is_deleted, updated_at, created_at,
		made, accepted, amount=made as is_done, amount=accepted as is_accepted
		FROM %s 
		LEFT JOIN LATERAL (SELECT SUM(amount) FROM %s WHERE position_id=positions.id) AS made ON true
		LEFT JOIN LATERAL (SELECT SUM(amount) FROM %s WHERE position_id=positions.id) AS accepted ON true
		WHERE order_id=$1 ORDER BY is_done, is_accepted, is_deleted, count`,
		PositionsTable, MadeTable, AcceptedTable,
	)
	data := []*models.Position{}

	if err := r.db.SelectContext(ctx, &data, query, req.OrderId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *PositionRepo) Create(ctx context.Context, dto *models.CreatePositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, order_id, name, note, amount) VALUES (:id, :order_id, :name, :note, :amount)`, PositionsTable)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) CreateSeveral(ctx context.Context, dto []*models.CreatePositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, order_id, name, note, amount) VALUES (:id, :order_id, :name, :note, :amount)`, PositionsTable)

	for i := range dto {
		dto[i].Id = uuid.NewString()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) Update(ctx context.Context, dto *models.UpdatePositionDTO) error {
	return fmt.Errorf("not implemented")
}
