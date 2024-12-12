package made

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
	service services.Made
}

func NewHandler(service services.Made) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Made, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	made := api.Group("/made")
	{
		made.GET("", middleware.CheckPermissions(constants.Made, constants.Read), handler.get)
		write := made.Group("", middleware.CheckPermissions(constants.Made, constants.Write))
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
	dto := &models.GetMadeDTO{
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
	dto := []*models.MadeDTO{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Изготовление позиций добавлено",
		logger.StringAttr("section", "made"),
		logger.IntAttr("count", len(dto)),
		// TODO можно попробовать добавить вывод массивов
	)

	c.JSON(http.StatusCreated, response.IdResponse{Message: "Успешно создано"})
}

func (h *Handler) update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty id", "ID не указан")
		return
	}

	dto := &models.MadeDTO{}
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

	logger.Info("Изготовление позиции обновлено",
		logger.StringAttr("section", "made"),
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

	dto := &models.DeleteMadeDTO{Id: id}
	if err := h.service.Delete(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	logger.Info("Изготовление позиции удалено",
		logger.StringAttr("section", "made"),
		logger.StringAttr("id", dto.Id),
	)

	c.Status(http.StatusNoContent)
}
