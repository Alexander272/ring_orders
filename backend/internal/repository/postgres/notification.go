package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/pkg/logger"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type NotificationRepo struct {
	db *sqlx.DB
}

func NewNotificationRepo(db *sqlx.DB) *NotificationRepo {
	return &NotificationRepo{
		db: db,
	}
}

type Notification interface {
	Get(ctx context.Context, req *models.GetNotificationsDTO) ([]*models.Notification, error)
	Create(ctx context.Context, dto *models.NotificationDTO) error
	CreateSeveral(ctx context.Context, dto []*models.NotificationDTO) error
	Delete(ctx context.Context, dto *models.DeleteNotificationDTO) error
}

func (r *NotificationRepo) Get(ctx context.Context, req *models.GetNotificationsDTO) ([]*models.Notification, error) {
	query := fmt.Sprintf(`SELECT id, user_id, title, text, link, date, priority FROM %s WHERE user_id=$1 ORDER BY date DESC`, NotificationsTable)
	data := []*models.Notification{}

	if err := r.db.SelectContext(ctx, &data, query, req.UserId); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *NotificationRepo) Create(ctx context.Context, dto *models.NotificationDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, user_id, title, text, link, date, priority) 
		VALUES (:id, :user_id, :title, :text, :link, :date, :priority)`,
		NotificationsTable,
	)
	dto.Id = uuid.NewString()
	dto.Date = time.Now().Unix()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *NotificationRepo) CreateSeveral(ctx context.Context, dto []*models.NotificationDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, user_id, title, text, link, date, priority) 
		VALUES (:id, :user_id, :title, :text, :link, :date, :priority)`,
		NotificationsTable,
	)
	for i := range dto {
		dto[i].Id = uuid.NewString()
		dto[i].Date = time.Now().Unix()
	}

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *NotificationRepo) Delete(ctx context.Context, dto *models.DeleteNotificationDTO) error {
	condition := "id=:id"
	if dto.UserId != "" {
		condition = "user_id=:user_id"
	}

	query := fmt.Sprintf(`DELETE FROM %s WHERE %s`, NotificationsTable, condition)
	logger.Debug("notifications", logger.StringAttr("query", query))

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
