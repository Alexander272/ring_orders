package http

import (
	"io/fs"
	"net/http"
	"strings"

	"github.com/Alexander272/ring_orders/backend/internal/config"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	http_v1 "github.com/Alexander272/ring_orders/backend/internal/transport/http/v1"
	"github.com/Alexander272/ring_orders/backend/pkg/auth"
	"github.com/Alexander272/ring_orders/backend/pkg/limiter"
	"github.com/Alexander272/ring_orders/backend/web"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	keycloak *auth.KeycloakClient
	services *services.Services
}

func NewHandler(services *services.Services, keycloak *auth.KeycloakClient) *Handler {
	return &Handler{
		services: services,
		keycloak: keycloak,
	}
}

func (h *Handler) Init(conf *config.Config) *gin.Engine {
	router := gin.Default()

	router.Use(
		limiter.Limit(conf.Limiter.RPS, conf.Limiter.Burst, conf.Limiter.TTL),
	)

	h.initAPI(router, conf)
	h.initStatic(router)

	return router
}

func (h *Handler) initAPI(router *gin.Engine, conf *config.Config) {
	middleware := middleware.NewMiddleware(h.services, conf.Auth, h.keycloak)
	handlerV1 := http_v1.NewHandler(http_v1.Deps{Services: h.services, Conf: conf, Middleware: middleware})

	api := router.Group("/api")
	{
		handlerV1.Init(api)
	}

	router.GET("/api/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})
}

func (h *Handler) initStatic(router *gin.Engine) {
	subFS, err := fs.Sub(web.Frontend, "frontend")
	if err != nil {
		return
	}

	router.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path

		if strings.HasPrefix(path, "/api") {
			c.Status(http.StatusNotFound)
			return
		}

		filePath := strings.TrimPrefix(path, "/")
		if f, err := subFS.Open(filePath); err == nil {
			f.Close()
			c.FileFromFS(filePath, http.FS(subFS))
			return
		}

		c.FileFromFS("index.html", http.FS(subFS))
	})
}
