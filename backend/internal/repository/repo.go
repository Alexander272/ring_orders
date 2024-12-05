package repository

import (
	"github.com/Alexander272/ring_orders/backend/internal/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type Role interface {
	postgres.Role
}
type MenuItem interface {
	postgres.MenuItem
}
type Menu interface {
	postgres.Menu
}

type Order interface {
	postgres.Order
}
type Position interface {
	postgres.Position
}
type Made interface {
	postgres.Made
}
type Accepted interface {
	postgres.Accepted
}

type Repository struct {
	Role
	MenuItem
	Menu

	Order
	Position
	Made
	Accepted
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Role:     postgres.NewRoleRepo(db),
		MenuItem: postgres.NewMenuItemRepo(db),
		Menu:     postgres.NewMenuRepo(db),

		Order:    postgres.NewOrderRepo(db),
		Position: postgres.NewPositionRepo(db),
		Made:     postgres.NewMadeRepo(db),
		Accepted: postgres.NewAcceptedRepo(db),
	}
}
