package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type MadeRepo struct {
	db *sqlx.DB
}

func NewMadeRepo(db *sqlx.DB) *MadeRepo {
	return &MadeRepo{
		db: db,
	}
}

type Made interface {
	Get(ctx context.Context, req *models.GetMadeDTO) ([]*models.Made, error)
	Create(ctx context.Context, dto *models.MadeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.MadeDTO) error
	Update(ctx context.Context, dto *models.MadeDTO) error
	Delete(ctx context.Context, dto *models.DeleteMadeDTO) error
}

func (r *MadeRepo) Get(ctx context.Context, req *models.GetMadeDTO) ([]*models.Made, error) {
	query := fmt.Sprintf(`SELECT id, position_id, date, amount, note, updated_at, created_at FROM %s WHERE position_id=$1 ORDER BY created_at DESC`,
		MadeTable,
	)
	data := []*models.Made{}

	if err := r.db.SelectContext(ctx, &data, query, req.PositionId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *MadeRepo) Create(ctx context.Context, dto *models.MadeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, date, amount, note) VALUES (:id, :position_id, :date, :amount, :note)`, MadeTable)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MadeRepo) CreateSeveral(ctx context.Context, dto []*models.MadeDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, date, amount, note) VALUES (:id, :position_id, :date, :amount, :note)`, MadeTable)

	for i := range dto {
		dto[i].Id = uuid.NewString()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MadeRepo) Update(ctx context.Context, dto *models.MadeDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET date=:date, amount=:amount, note=:note, updated_at=now() WHERE id=:id`, MadeTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *MadeRepo) Delete(ctx context.Context, dto *models.DeleteMadeDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, MadeTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
