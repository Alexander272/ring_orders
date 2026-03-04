package statistics

import (
	"net/http"
	"time"

	"github.com/Alexander272/ring_orders/backend/internal/constants"
	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Statistics
}

func NewHandler(service services.Statistics) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Statistics, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	statistics := api.Group("/statistics", middleware.VerifyToken)
	{
		read := statistics.Group("", middleware.CheckPermissions(constants.Statistics, constants.Read))
		{
			read.GET("", handler.getPosition)
		}
	}
}

func (h *Handler) getPosition(c *gin.Context) {
	req := &models.GetPositionStatsDTO{}
	startTime, err := parseTimeWithDefault(c, "start", time.Time{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	endTime, err := parseTimeWithDefault(c, "end", time.Time{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	req.PeriodStart = startTime
	req.PeriodEnd = endTime

	data, err := h.service.GetPosition(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func parseTimeWithDefault(c *gin.Context, paramName string, defaultTime time.Time) (time.Time, error) {
	value := c.DefaultQuery(paramName, defaultTime.Format(time.RFC3339))
	return time.Parse(time.RFC3339, value)
}
