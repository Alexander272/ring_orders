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

	Notification

	Order
	Position
	Made
	Accepted
	Sent
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

	notification := NewNotificationService(deps.Repos.Notification, deps.Keycloak)

	made := NewMadeService(deps.Repos.Made)
	accepted := NewAcceptedService(deps.Repos.Accepted)
	sent := NewSentService(deps.Repos.Sent)
	position := NewPositionService(deps.Repos.Position)
	order := NewOrderService(deps.Repos.Order, position, notification)

	return &Services{
		MenuItem:   menuItem,
		Menu:       menu,
		Role:       role,
		Session:    session,
		Permission: permission,

		Notification: notification,

		Order:    order,
		Position: position,
		Made:     made,
		Accepted: accepted,
		Sent:     sent,
	}
}
