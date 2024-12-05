package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type AcceptedService struct {
	repo repository.Accepted
}

func NewAcceptedService(repo repository.Accepted) *AcceptedService {
	return &AcceptedService{repo: repo}
}

type Accepted interface {
	Get(ctx context.Context, req *models.GetAcceptedDTO) ([]*models.Accepted, error)
	Create(ctx context.Context, dto []*models.AcceptedDTO) error
	Update(ctx context.Context, dto *models.AcceptedDTO) error
	Delete(ctx context.Context, dto *models.DeleteAcceptedDTO) error
}

func (s *AcceptedService) Get(ctx context.Context, req *models.GetAcceptedDTO) ([]*models.Accepted, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get accepted. error: %w", err)
	}
	return data, nil
}

func (s *AcceptedService) Create(ctx context.Context, dto []*models.AcceptedDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create accepted. error: %w", err)
	}
	return nil
}

func (s *AcceptedService) Update(ctx context.Context, dto *models.AcceptedDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update accepted. error: %w", err)
	}
	return nil
}

func (s *AcceptedService) Delete(ctx context.Context, dto *models.DeleteAcceptedDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete accepted. error: %w", err)
	}
	return nil
}
