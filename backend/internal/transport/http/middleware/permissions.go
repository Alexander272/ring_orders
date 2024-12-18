package middleware

import (
	"net/http"

	"github.com/Alexander272/ring_orders/backend/internal/constants"
	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

func (m *Middleware) CheckPermissions(menuItem, method string) gin.HandlerFunc {
	return func(c *gin.Context) {
		u, exists := c.Get(constants.CtxUser)
		if !exists {
			response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "сессия не найдена")
			return
		}

		user := u.(models.User)

		access, err := m.services.Permission.Enforce(user.Role, menuItem, method)
		if err != nil {
			response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
			return
		}
		logger.Debug("permissions", logger.StringAttr("menu", menuItem), logger.StringAttr("method", method), logger.BoolAttr("access", access))

		if !access {
			response.NewErrorResponse(c, http.StatusForbidden, "access denied", "нет доступа к данному разделу")
			return
		}

		c.Next()
	}
}
