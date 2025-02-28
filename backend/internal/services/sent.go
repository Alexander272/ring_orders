package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type SentService struct {
	repo repository.Sent
}

func NewSentService(repo repository.Sent) *SentService {
	return &SentService{
		repo: repo,
	}
}

type Sent interface {
	Get(ctx context.Context, req *models.GetSentDTO) ([]*models.Sent, error)
	Create(ctx context.Context, dto *models.SentDTO) error
	CreateSeveral(ctx context.Context, dto []*models.SentDTO) error
	Update(ctx context.Context, dto *models.SentDTO) error
	Delete(ctx context.Context, dto *models.DeleteSentDTO) error
}

func (s *SentService) Get(ctx context.Context, req *models.GetSentDTO) ([]*models.Sent, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get sent. error: %w", err)
	}
	return data, nil
}

func (s *SentService) Create(ctx context.Context, dto *models.SentDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create sent. error: %w", err)
	}
	return nil
}

func (s *SentService) CreateSeveral(ctx context.Context, dto []*models.SentDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create some sent. error: %w", err)
	}
	return nil
}

func (s *SentService) Update(ctx context.Context, dto *models.SentDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update sent. error: %w", err)
	}
	return nil
}

func (s *SentService) Delete(ctx context.Context, dto *models.DeleteSentDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete sent. error: %w", err)
	}
	return nil
}
