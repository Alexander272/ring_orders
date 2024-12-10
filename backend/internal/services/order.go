package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/repository"
)

type OrderService struct {
	repo     repository.Order
	position Position
}

func NewOrderService(repo repository.Order, position Position) *OrderService {
	return &OrderService{
		repo:     repo,
		position: position,
	}
}

type Order interface {
	Get(ctx context.Context, req *models.GetOrderDTO) ([]*models.Order, error)
	GetById(ctx context.Context, id string) (*models.Order, error)
	GetImportant(ctx context.Context) (*models.ImportantOrders, error)
	Create(ctx context.Context, dto *models.CreateOrderDTO) error
	Update(ctx context.Context, dto *models.OrderDTO) error
	Delete(ctx context.Context, dto *models.DeleteOrderDTO) error
}

func (s *OrderService) Get(ctx context.Context, req *models.GetOrderDTO) ([]*models.Order, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) GetById(ctx context.Context, id string) (*models.Order, error) {
	data, err := s.repo.GetById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get order by id. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) GetImportant(ctx context.Context) (*models.ImportantOrders, error) {
	data, err := s.repo.GetImportant(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get important orders. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) Create(ctx context.Context, dto *models.CreateOrderDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create order. error: %w", err)
	}

	for i := range dto.Positions {
		dto.Positions[i].OrderId = dto.Id
	}

	if err := s.position.CreateSeveral(ctx, dto.Positions); err != nil {
		return err
	}
	return nil
}

func (s *OrderService) Update(ctx context.Context, dto *models.OrderDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update order. error: %w", err)
	}
	return nil
}

func (s *OrderService) Delete(ctx context.Context, dto *models.DeleteOrderDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete order. error: %w", err)
	}
	return nil
}
