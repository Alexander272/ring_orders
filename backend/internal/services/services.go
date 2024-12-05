package services

import (
	"time"

	"github.com/Alexander272/ring_orders/backend/internal/repository"
	"github.com/Alexander272/ring_orders/backend/pkg/auth"
)

type Services struct{}

type Deps struct {
	Repos           *repository.Repository
	Keycloak        *auth.KeycloakClient
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

func NewServices(deps *Deps) *Services {
	return &Services{}
}
