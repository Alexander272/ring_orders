package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type MadeService struct {
	repo repository.Made
}

func NewMadeService(repo repository.Made) *MadeService {
	return &MadeService{repo: repo}
}

type Made interface {
	Get(ctx context.Context, req *models.GetMadeDTO) ([]*models.Made, error)
	Create(ctx context.Context, dto *models.MadeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.MadeDTO) error
	Update(ctx context.Context, dto *models.MadeDTO) error
	Delete(ctx context.Context, dto *models.DeleteMadeDTO) error
}

func (s *MadeService) Get(ctx context.Context, req *models.GetMadeDTO) ([]*models.Made, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get made. error: %w", err)
	}
	return data, nil
}

func (s *MadeService) Create(ctx context.Context, dto *models.MadeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create made. error: %w", err)
	}
	return nil
}

func (s *MadeService) CreateSeveral(ctx context.Context, dto []*models.MadeDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several made. error: %w", err)
	}
	return nil
}

func (s *MadeService) Update(ctx context.Context, dto *models.MadeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update made. error: %w", err)
	}
	return nil
}

func (s *MadeService) Delete(ctx context.Context, dto *models.DeleteMadeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete made. error: %w", err)
	}
	return nil
}
