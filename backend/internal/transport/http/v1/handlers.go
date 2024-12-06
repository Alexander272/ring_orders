package v1

import (
	"github.com/Alexander272/ring_orders/backend/internal/config"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/accepted"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/auth"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/made"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/order"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/position"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services   *services.Services
	conf       *config.Config
	middleware *middleware.Middleware
}

type Deps struct {
	Services   *services.Services
	Conf       *config.Config
	Middleware *middleware.Middleware
}

func NewHandler(deps Deps) *Handler {
	return &Handler{
		services:   deps.Services,
		conf:       deps.Conf,
		middleware: deps.Middleware,
	}
}

func (h *Handler) Init(group *gin.RouterGroup) {
	v1 := group.Group("/v1")

	auth.Register(v1, auth.Deps{Service: h.services.Session, Auth: h.conf.Auth})
	// roles.Register(v1, h.services.Role, h.middleware)

	order.Register(v1, h.services.Order, h.middleware)
	position.Register(v1, h.services.Position, h.middleware)
	accepted.Register(v1, h.services.Accepted, h.middleware)
	made.Register(v1, h.services.Made, h.middleware)
}
