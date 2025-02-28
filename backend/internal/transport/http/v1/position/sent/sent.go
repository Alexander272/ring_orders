package sent

import (
	"net/http"

	"github.com/Alexander272/ring_orders/backend/internal/constants"
	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
	"github.com/Alexander272/ring_orders/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Sent
}

func NewHandler(service services.Sent) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Sent, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	sent := api.Group("/sent")
	{
		sent.GET("", middleware.CheckPermissions(constants.Sent, constants.Read), handler.get)
		write := sent.Group("", middleware.CheckPermissions(constants.Sent, constants.Write))
		{
			write.POST("", handler.create)
			write.PUT("/:id", handler.update)
			write.DELETE("/:id", handler.delete)
		}
	}
}

func (h *Handler) get(c *gin.Context) {
	positionId := c.Query("position")
	if positionId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty position", "Позиция не указана")
		return
	}
	dto := &models.GetSentDTO{
		PositionId: positionId,
	}

	sent, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: sent, Total: len(sent)})
}

func (h *Handler) create(c *gin.Context) {
	dto := []*models.SentDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Отправление позиций добавлено",
		logger.StringAttr("section", "sent"),
		logger.IntAttr("count", len(dto)),
	)

	c.JSON(http.StatusCreated, response.IdResponse{Message: "Успешно создано"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty id", "ID не указан")
		return
	}

	dto := &models.SentDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Отправление позиции обновлено",
		logger.StringAttr("section", "sent"),
		logger.StringAttr("id", dto.Id),
		logger.AnyAttr("dto", dto),
	)

	c.JSON(http.StatusOK, response.IdResponse{Message: "Успешно обновлено"})
}

func (h *Handler) delete(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty id", "ID не указан")
		return
	}

	dto := &models.DeleteSentDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Отправление позиции удалено",
		logger.StringAttr("section", "sent"),
		logger.StringAttr("id", dto.Id),
	)

	c.Status(http.StatusNoContent)
}
