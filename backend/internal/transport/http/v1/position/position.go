package position

import (
	"net/http"

	"github.com/Alexander272/ring_orders/backend/internal/constants"
	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/position/accepted"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/position/made"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/v1/position/sent"
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

func Register(api *gin.RouterGroup, service *services.Services, middleware *middleware.Middleware) {
	handler := NewHandler(service.Position)

	positions := api.Group("/positions", middleware.VerifyToken)
	{
		positions.GET("", middleware.CheckPermissions(constants.Positions, constants.Read), handler.get)
		positions.PUT("/several", middleware.CheckPermissions(constants.Positions, constants.Write), handler.update)
	}

	made.Register(positions, service.Made, middleware)
	accepted.Register(positions, service.Accepted, middleware)
	sent.Register(positions, service.Sent, middleware)
}

func (h *Handler) get(c *gin.Context) {
	orderId := c.Query("order")
	if orderId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty order", "Заказ не указан")
		return
	}
	sort := c.Query("sort")

	dto := &models.GetPositionDTO{OrderId: orderId, Sort: sort}
	data, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) update(c *gin.Context) {
	dto := []*models.UpdatePositionDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: dto})
}
