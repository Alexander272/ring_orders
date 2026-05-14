package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type RejectRepo struct {
	db *sqlx.DB
}

func NewRejectRepo(db *sqlx.DB) *RejectRepo {
	return &RejectRepo{
		db: db,
	}
}

type Reject interface {
	Get(ctx context.Context, req *models.GetRejectDTO) ([]*models.Reject, error)
	Create(ctx context.Context, dto []*models.RejectDTO) error
	Update(ctx context.Context, dto *models.RejectDTO) error
	Delete(ctx context.Context, dto *models.DeleteRejectDTO) error
}

func (r *RejectRepo) Get(ctx context.Context, req *models.GetRejectDTO) ([]*models.Reject, error) {
	query := fmt.Sprintf(`SELECT id, position_id, date, amount, note, updated_at, created_at FROM %s WHERE position_id=$1 ORDER BY created_at DESC`,
		RejectsTable,
	)
	data := []*models.Reject{}

	if err := r.db.SelectContext(ctx, &data, query, req.PositionId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *RejectRepo) Create(ctx context.Context, dto []*models.RejectDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, date, amount, note) VALUES (:id, :position_id, :date, :amount, :note)`, RejectsTable)

	for i := range dto {
		dto[i].Id = uuid.NewString()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *RejectRepo) Update(ctx context.Context, dto *models.RejectDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET date=:date, amount=:amount, note=:note, updated_at=now() WHERE id=:id`, RejectsTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *RejectRepo) Delete(ctx context.Context, dto *models.DeleteRejectDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, RejectsTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
