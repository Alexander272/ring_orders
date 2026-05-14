package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type RejectService struct {
	repo repository.Reject
}

func NewRejectService(repo repository.Reject) *RejectService {
	return &RejectService{repo: repo}
}

type Reject interface {
	Get(ctx context.Context, req *models.GetRejectDTO) ([]*models.Reject, error)
	Create(ctx context.Context, dto []*models.RejectDTO) error
	Update(ctx context.Context, dto *models.RejectDTO) error
	Delete(ctx context.Context, dto *models.DeleteRejectDTO) error
}

func (s *RejectService) Get(ctx context.Context, req *models.GetRejectDTO) ([]*models.Reject, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get rejects. error: %w", err)
	}
	return data, nil
}

func (s *RejectService) Create(ctx context.Context, dto []*models.RejectDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create rejects. error: %w", err)
	}
	return nil
}

func (s *RejectService) Update(ctx context.Context, dto *models.RejectDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update reject. error: %w", err)
	}
	return nil
}

func (s *RejectService) Delete(ctx context.Context, dto *models.DeleteRejectDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete reject. error: %w", err)
	}
	return nil
}
