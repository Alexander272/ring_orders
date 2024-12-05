package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type AcceptedRepo struct {
	db *sqlx.DB
}

func NewAcceptedRepo(db *sqlx.DB) *AcceptedRepo {
	return &AcceptedRepo{
		db: db,
	}
}

type Accepted interface {
	Get(ctx context.Context, req *models.GetAcceptedDTO) ([]*models.Accepted, error)
	Create(ctx context.Context, dto []*models.AcceptedDTO) error
	Update(ctx context.Context, dto *models.AcceptedDTO) error
	Delete(ctx context.Context, dto *models.DeleteAcceptedDTO) error
}

func (r *AcceptedRepo) Get(ctx context.Context, req *models.GetAcceptedDTO) ([]*models.Accepted, error) {
	query := fmt.Sprintf(`SELECT id, position_id, date, amount, note, updated_at, created_at FROM %s WHERE position_id=$1 ORDER BY created_at DESC`,
		AcceptedTable,
	)
	data := []*models.Accepted{}

	if err := r.db.SelectContext(ctx, &data, query, req.PositionId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *AcceptedRepo) Create(ctx context.Context, dto []*models.AcceptedDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, date, amount, note) VALUES (:id, :position_id, :date, :amount, :note)`, AcceptedTable)

	for i := range dto {
		dto[i].Id = uuid.NewString()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *AcceptedRepo) Update(ctx context.Context, dto *models.AcceptedDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET date=:date, amount=:amount, note=:note, updated_at=now() WHERE id=:id`, AcceptedTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *AcceptedRepo) Delete(ctx context.Context, dto *models.DeleteAcceptedDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, AcceptedTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
