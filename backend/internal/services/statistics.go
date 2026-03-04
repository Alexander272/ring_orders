package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type StatisticsService struct {
	repo repository.Statistics
}

func NewStatisticsService(repo repository.Statistics) *StatisticsService {
	return &StatisticsService{
		repo: repo,
	}
}

type Statistics interface {
	GetPosition(ctx context.Context, req *models.GetPositionStatsDTO) ([]*models.PositionStats, error)
}

func (s *StatisticsService) GetPosition(ctx context.Context, req *models.GetPositionStatsDTO) ([]*models.PositionStats, error) {
	data, err := s.repo.GetPosition(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get positions. error: %w", err)
	}
	return data, nil
}
