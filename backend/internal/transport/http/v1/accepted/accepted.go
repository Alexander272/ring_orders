package accepted

import (
	"net/http"

	"github.com/Alexander272/ring_orders/backend/internal/models"
	"github.com/Alexander272/ring_orders/backend/internal/models/response"
	"github.com/Alexander272/ring_orders/backend/internal/services"
	"github.com/Alexander272/ring_orders/backend/internal/transport/http/middleware"
	"github.com/Alexander272/ring_orders/backend/pkg/error_bot"
	"github.com/Alexander272/ring_orders/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Accepted
}

func NewHandler(service services.Accepted) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Accepted, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	accepted := api.Group("/accepted")
	{
		accepted.GET("", handler.get)
		accepted.POST("", handler.create)
		accepted.PUT("/:id", handler.update)
		accepted.DELETE("/:id", handler.delete)
	}
}

func (h *Handler) get(c *gin.Context) {
	positionId := c.Query("position")
	if positionId == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty position", "Позиция не указана")
		return
	}
	dto := &models.GetAcceptedDTO{
		PositionId: positionId,
	}

	made, err := h.service.Get(c, dto)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: made, Total: len(made)})
}

func (h *Handler) create(c *gin.Context) {
	dto := []*models.AcceptedDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Принятые позиции добавлены",
		logger.StringAttr("section", "accepted"),
		logger.IntAttr("count", len(dto)),
		logger.AnyAttr("dto", dto),
	)

	c.JSON(http.StatusCreated, response.IdResponse{Message: "Успешно создано"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty id", "ID не указан")
		return
	}

	dto := &models.AcceptedDTO{}
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

	logger.Info("Принятая позиция обновлена",
		logger.StringAttr("section", "accepted"),
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

	dto := &models.DeleteAcceptedDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Принятая позиция удалена",
		logger.StringAttr("section", "accepted"),
		logger.StringAttr("id", dto.Id),
	)

	c.Status(http.StatusNoContent)
}
