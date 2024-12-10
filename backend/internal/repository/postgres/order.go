package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type OrderRepo struct {
	db *sqlx.DB
}

func NewOrderRepo(db *sqlx.DB) *OrderRepo {
	return &OrderRepo{
		db: db,
	}
}

type Order interface {
	Get(ctx context.Context, req *models.GetOrderDTO) ([]*models.Order, error)
	GetById(ctx context.Context, id string) (*models.Order, error)
	GetImportant(ctx context.Context) (*models.ImportantOrders, error)
	Create(ctx context.Context, dto *models.CreateOrderDTO) error
	Update(ctx context.Context, order *models.OrderDTO) error
	Delete(ctx context.Context, dto *models.DeleteOrderDTO) error
}

func (r *OrderRepo) getColumnName(field string) string {
	columns := map[string]string{
		"count":          "count",
		"orderNumber":    "order_number",
		"notes":          "notes",
		"dateOfIssue":    "date_of_issue",
		"dateOfDispatch": "date_of_dispatch",
		"closingDate":    "closing_date",
		"urgent":         "urgent",
		"status":         "status",
		"updatedAt":      "updated_at",
		"createdAt":      "created_at",
	}

	return columns[field]
}

func (r *OrderRepo) Get(ctx context.Context, req *models.GetOrderDTO) ([]*models.Order, error) {
	params := []interface{}{}
	count := 1

	sorts := []string{}
	for _, s := range req.Sort {
		sorts = append(sorts, fmt.Sprintf("%s %s", r.getColumnName(s.Field), s.Type))
	}
	order := ""
	if len(sorts) > 0 {
		order = fmt.Sprintf("ORDER BY %s", strings.Join(sorts, ", "))
	}

	filters := []string{}
	for _, ns := range req.Filters {
		for _, sv := range ns.Values {
			filters = append(filters, getFilterLine(sv.CompareType, r.getColumnName(ns.Field), count))
			if sv.CompareType == "in" {
				sv.Value = strings.ReplaceAll(sv.Value, ",", "|")
			}
			params = append(params, sv.Value)
			count++
		}
	}
	filter := ""
	if len(filters) > 0 {
		filter = fmt.Sprintf("WHERE %s", strings.Join(filters, " AND "))
	}

	params = append(params, req.Page.Limit, req.Page.Offset)

	query := fmt.Sprintf(`SELECT id, count, order_number, notes, date_of_issue, date_of_dispatch, date_of_adoption, closing_date, 
		urgent, status, updated_at, created_at, COUNT(*) OVER() as total_count FROM %s %s %s LIMIT $%d OFFSET $%d`,
		OrdersTable, filter, order, count, count+1,
	)
	data := []*models.Order{}

	if err := r.db.SelectContext(ctx, &data, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *OrderRepo) GetById(ctx context.Context, id string) (*models.Order, error) {
	query := fmt.Sprintf(`SELECT id, count, order_number, notes, date_of_issue, date_of_dispatch, date_of_adoption, closing_date, 
		urgent, status, updated_at, created_at FROM %s WHERE id=$1`,
		OrdersTable,
	)
	data := &models.Order{}

	if err := r.db.GetContext(ctx, data, query, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, models.ErrNoRows
		}
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *OrderRepo) GetImportant(ctx context.Context) (*models.ImportantOrders, error) {
	query := fmt.Sprintf(`SELECT COUNT(CASE WHEN urgent = TRUE THEN 1 END) AS urgent, 
		COUNT(CASE WHEN date_of_dispatch < $1 THEN 1 END) AS overdue, COUNT(CASE WHEN date_of_dispatch-$2 <= $3 THEN 1 END) AS nearest
		FROM %s WHERE closing_date = 0`,
		OrdersTable,
	)

	data := &models.ImportantOrders{}
	now := time.Now()
	overdue := time.Date(now.Year(), now.Month(), now.Day()+1, 0, 0, 0, 0, time.Local).Unix()
	nearest := time.Date(now.Year(), now.Month(), now.Day()-1, 0, 0, 0, 0, time.Local).Unix()

	day := time.Duration(2) * time.Hour * 24

	if err := r.db.GetContext(ctx, data, query, overdue, nearest, day.Seconds()); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *OrderRepo) Create(ctx context.Context, dto *models.CreateOrderDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, order_number, notes, date_of_issue, date_of_dispatch, urgent, status) 
		VALUES (:id, :order_number, :notes, :date_of_issue, :date_of_dispatch, :urgent, :status)`,
		OrdersTable,
	)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrderRepo) Update(ctx context.Context, dto *models.OrderDTO) error {
	//TODO надо наверное как-то обновлять только часть полей
	query := fmt.Sprintf(`UPDATE %s SET notes=:notes, date_of_dispatch=:date_of_dispatch, date_of_adoption=:date_of_adoption, closing_date=:closing_date,
		urgent=:urgent, status=:status, updated_at=now() WHERE id=:id`,
		OrdersTable,
	)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrderRepo) Delete(ctx context.Context, dto *models.DeleteOrderDTO) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=:id`, OrdersTable)

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
