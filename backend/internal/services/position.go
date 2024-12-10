package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type PositionService struct {
	repo repository.Position
}

func NewPositionService(repo repository.Position) *PositionService {
	return &PositionService{repo: repo}
}

type Position interface {
	Get(ctx context.Context, req *models.GetPositionDTO) ([]*models.Position, error)
	Create(ctx context.Context, dto *models.CreatePositionDTO) error
	CreateSeveral(ctx context.Context, dto []*models.CreatePositionDTO) error
	Update(ctx context.Context, dto *models.UpdatePositionDTO) error
	UpdateSeveral(ctx context.Context, dto []*models.UpdatePositionDTO) error
}

func (s *PositionService) Get(ctx context.Context, req *models.GetPositionDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get positions. error: %w", err)
	}
	return data, nil
}

func (s *PositionService) Create(ctx context.Context, dto *models.CreatePositionDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create position. error: %w", err)
	}
	return nil
}

func (s *PositionService) CreateSeveral(ctx context.Context, dto []*models.CreatePositionDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several positions. error: %w", err)
	}
	return nil
}

func (s *PositionService) Update(ctx context.Context, dto *models.UpdatePositionDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update positions. error: %w", err)
	}
	return nil
}

func (s *PositionService) UpdateSeveral(ctx context.Context, dto []*models.UpdatePositionDTO) error {
	if err := s.repo.UpdateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to update several positions. error: %w", err)
	}
	return nil
}

// func (s *PositionService) Delete(ctx context.Context, dto *models.DeletePositionDTO) error {
// 	if err := s.repo.Delete(ctx, dto); err != nil {
// 		return fmt.Errorf("failed to delete positions. error: %w", err)
// 	}
// 	return nil
// }
