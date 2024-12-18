package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
	"github.com/Alexander272/ring_orders/backend/pkg/auth"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
)

type NotificationService struct {
	repo     repository.Notification
	keycloak *auth.KeycloakClient
}

func NewNotificationService(repo repository.Notification, keycloak *auth.KeycloakClient) *NotificationService {
	return &NotificationService{
		repo:     repo,
		keycloak: keycloak,
	}
}

type Notification interface {
	NewMessage(ctx context.Context, dto *models.NotificationDTO)
	Get(ctx context.Context, req *models.GetNotificationsDTO) ([]*models.Notification, error)
	Create(ctx context.Context, dto *models.NotificationDTO) error
	CreateSeveral(ctx context.Context, dto []*models.NotificationDTO) error
	Delete(ctx context.Context, dto *models.DeleteNotificationDTO) error
}

func (s *NotificationService) NewMessage(ctx context.Context, dto *models.NotificationDTO) {
	go s.Publish(ctx, dto)
}

func (s *NotificationService) Publish(ctx context.Context, dto *models.NotificationDTO) {
	users, err := s.ExtractUsers(ctx, dto.Groups)
	if err != nil {
		error_bot.Send(nil, err.Error(), dto)
		return
	}

	messages := []*models.NotificationDTO{}

	for _, u := range users {
		mes := &models.NotificationDTO{
			UserId:   u,
			Title:    dto.Title,
			Text:     dto.Text,
			Link:     dto.Link,
			Priority: dto.Priority,
		}
		messages = append(messages, mes)
	}

	if err := s.CreateSeveral(ctx, messages); err != nil {
		error_bot.Send(nil, err.Error(), messages)
		return
	}
}

func (s *NotificationService) ExtractUsers(ctx context.Context, dto []models.Group) ([]string, error) {
	users := []string{}

	for _, g := range dto {
		group, err := s.keycloak.GetGroupId(ctx, string(g))
		if err != nil {
			return nil, fmt.Errorf("failed to get group. error: %w", err)
		}

		members, err := s.keycloak.GetGroupMembers(ctx, *group.ID)
		if err != nil {
			return nil, fmt.Errorf("failed to get group members. error: %w", err)
		}

		for _, m := range members {
			users = append(users, *m.ID)
		}
	}
	return users, nil
}

func (s *NotificationService) Get(ctx context.Context, req *models.GetNotificationsDTO) ([]*models.Notification, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get notifications. error: %w", err)
	}
	return data, nil
}

func (s *NotificationService) Create(ctx context.Context, dto *models.NotificationDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create notification. error: %w", err)
	}
	return nil
}

func (s *NotificationService) CreateSeveral(ctx context.Context, dto []*models.NotificationDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create notifications. error: %w", err)
	}
	return nil
}

func (s *NotificationService) Delete(ctx context.Context, dto *models.DeleteNotificationDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete notifications. error: %w", err)
	}
	return nil
}
