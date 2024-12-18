package notification

import (
	"net/http"

	"github.com/Alexander272/ring_orders/backend/internal/constants"
	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Notification
}

func NewHandler(service services.Notification) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Notification, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	notifications := api.Group("/notifications", middleware.VerifyToken)
	{
		notifications.GET("", handler.Get)
		notifications.DELETE("", handler.Delete)
	}
}

func (h *Handler) Get(c *gin.Context) {
	user := models.User{}
	u, exists := c.Get(constants.CtxUser)
	if exists {
		user = u.(models.User)
	}

	dto := &models.GetNotificationsDTO{UserId: user.Id}
	notifications, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: notifications, Total: len(notifications)})
}

func (h *Handler) Delete(c *gin.Context) {
	id := c.Query("id")

	user := models.User{}
	u, exists := c.Get(constants.CtxUser)
	if exists {
		user = u.(models.User)
	}
	dto := &models.DeleteNotificationDTO{Id: id}
	if id == "" || id == "null" {
		dto.UserId = user.Id
	}

	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Успешно удалено"})
}
