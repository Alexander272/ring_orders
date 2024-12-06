package services

import (
	"time"

	"github.com/Alexander272/ring_orders/backend/internal/repository"
	"github.com/Alexander272/ring_orders/backend/pkg/auth"
)

type Services struct {
	Menu
	MenuItem
	Role
	Session
	Permission

	Order
	Position
	Made
	Accepted
}

type Deps struct {
	Repos           *repository.Repository
	Keycloak        *auth.KeycloakClient
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

func NewServices(deps *Deps) *Services {
	menuItem := NewMenuItemService(deps.Repos.MenuItem)
	menu := NewMenuService(deps.Repos.Menu, menuItem)
	role := NewRoleService(deps.Repos.Role)
	session := NewSessionService(deps.Keycloak, role)
	permission := NewPermissionService("configs/privacy.conf", menu, role)

	made := NewMadeService(deps.Repos.Made)
	accepted := NewAcceptedService(deps.Repos.Accepted)
	position := NewPositionService(deps.Repos.Position)
	order := NewOrderService(deps.Repos.Order, position)

	return &Services{
		MenuItem:   menuItem,
		Menu:       menu,
		Role:       role,
		Session:    session,
		Permission: permission,

		Order:    order,
		Position: position,
		Made:     made,
		Accepted: accepted,
	}
}
