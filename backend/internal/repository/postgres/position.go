package postgres

import (
	"context"
	"fmt"
	"strings"

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
	UpdateSeveral(ctx context.Context, dto []*models.UpdatePositionDTO) error
}

func (r *PositionRepo) Get(ctx context.Context, req *models.GetPositionDTO) ([]*models.Position, error) {
	sort := ""
	if req.Sort != "" {
		if req.Sort == "isAccepted" {
			sort = "is_accepted,"
		}
		if req.Sort == "isDone" {
			sort = "is_sent,"
		}
	}

	query := fmt.Sprintf(`SELECT id, count, name, note, amount, is_deleted, updated_at, created_at,
		COALESCE(sum_made, 0) AS made, COALESCE(sum_acc, 0) AS accepted, COALESCE(sum_sent, 0) AS sent, amount<=COALESCE(sum_made, 0) as is_done, 
		(COALESCE(sum_made, 0)=COALESCE(sum_sent, 0) AND amount<=COALESCE(sum_sent, 0)) AS is_sent, amount<=COALESCE(sum_acc, 0) as is_accepted
		FROM %s 
		LEFT JOIN LATERAL (SELECT SUM(amount) AS sum_made FROM %s WHERE position_id=positions.id) AS made ON true
		LEFT JOIN LATERAL (SELECT SUM(amount) AS sum_acc FROM %s WHERE position_id=positions.id) AS accepted ON true
		LEFT JOIN LATERAL (SELECT SUM(quantity) AS sum_sent FROM %s WHERE position_id=positions.id) AS sent ON true
		WHERE order_id=$1 ORDER BY is_deleted, %s count`,
		PositionsTable, MadeTable, AcceptedTable, SentTable, sort,
	)
	data := []*models.Position{}

	if err := r.db.SelectContext(ctx, &data, query, req.OrderId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *PositionRepo) Create(ctx context.Context, dto *models.CreatePositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, count, order_id, name, note, amount) VALUES (:id, :count, :order_id, :name, :note, :amount)`, PositionsTable)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) CreateSeveral(ctx context.Context, dto []*models.CreatePositionDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, count, order_id, name, note, amount) VALUES (:id, :count, :order_id, :name, :note, :amount)`, PositionsTable)

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
	query := fmt.Sprintf(`UPDATE %s SET note=:note, amount=:amount, is_deleted=:is_deleted, updated_at=now() WHERE id=:id`, PositionsTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *PositionRepo) UpdateSeveral(ctx context.Context, dto []*models.UpdatePositionDTO) error {
	values := []string{}
	args := []interface{}{}
	c := 4
	for i, v := range dto {
		args = append(args, v.Id, v.Note, v.Amount, v.IsDeleted)
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4))
	}

	query := fmt.Sprintf(`UPDATE %s AS t SET note=s.note, amount=s.amount::integer, is_deleted=s.is_deleted::boolean, updated_at=now() 
		FROM (VALUES %s) AS s(id, note, amount, is_deleted) WHERE t.id=s.id::uuid`,
		PositionsTable, strings.Join(values, ","),
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
