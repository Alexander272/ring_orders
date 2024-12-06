package position

import (
	"net/http"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Position
}

func NewHandler(service services.Position) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Position, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	positions := api.Group("/positions")
	{
		positions.GET("", handler.get)
		// positions.PUT("/:id", handler.update)
	}
}

func (h *Handler) get(c *gin.Context) {
	orderId := c.Query("order")
	if orderId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty order", "Заказ не указан")
		return
	}

	dto := &models.GetPositionDTO{OrderId: orderId}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}
