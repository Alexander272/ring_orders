package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SentRepo struct {
	db *sqlx.DB
}

func NewSentRepo(db *sqlx.DB) *SentRepo {
	return &SentRepo{
		db: db,
	}
}

type Sent interface {
	Get(ctx context.Context, req *models.GetSentDTO) ([]*models.Sent, error)
	Create(ctx context.Context, dto *models.SentDTO) error
	CreateSeveral(ctx context.Context, dto []*models.SentDTO) error
	Update(ctx context.Context, dto *models.SentDTO) error
	Delete(ctx context.Context, dto *models.DeleteSentDTO) error
}

func (r *SentRepo) Get(ctx context.Context, req *models.GetSentDTO) ([]*models.Sent, error) {
	query := fmt.Sprintf(`SELECT id, position_id, date, quantity, note, updated_at, created_at FROM %s WHERE position_id=$1 
		ORDER BY created_at DESC`,
		SentTable,
	)
	data := []*models.Sent{}

	if err := r.db.SelectContext(ctx, &data, query, req.PositionId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SentRepo) Create(ctx context.Context, dto *models.SentDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, date, quantity, note) VALUES (:id, :position_id, :date, :quantity, :note)`, SentTable)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SentRepo) CreateSeveral(ctx context.Context, dto []*models.SentDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, position_id, date, quantity, note) VALUES (:id, :position_id, :date, :quantity, :note)`, SentTable)
	for i := range dto {
		dto[i].Id = uuid.NewString()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SentRepo) Update(ctx context.Context, dto *models.SentDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET date=:date, quantity=:quantity, note=:note, updated_at=now() WHERE id=:id`, SentTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SentRepo) Delete(ctx context.Context, dto *models.DeleteSentDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, SentTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
